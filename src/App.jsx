import { useCallback, useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Toast } from './components/Toast.jsx';
import { PayModal } from './components/PayModal.jsx';
import { Login } from './pages/Login.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Circle } from './pages/Circle.jsx';
import { Live } from './pages/Live.jsx';
import { CreateCircle } from './pages/CreateCircle.jsx';
import { Owner } from './pages/Owner.jsx';
import { NotificationSettings } from './pages/NotificationSettings.jsx';
import { supabase } from './lib/supabase.js';
import { useAuth } from './lib/useAuth.js';
import { useMember } from './lib/useMember.js';
import { useCircleData } from './lib/useCircleData.js';
import {
  createCircleWithOwner,
  fetchOwnerSlips,
  setSlipStatus,
  previewCircleByInviteCode,
  joinCircleByInviteCode,
} from './lib/circles.js';
import { BID_SCRIPT, fmt, fmtDate } from './data.js';

// Parameters for the "ห้องเปียสด" live-auction preview -- a scripted demo,
// not yet wired to a real circle's bid_type/bid_cap. See Live.jsx banner.
const BID_SECONDS = 60;
const AUTO_BIDDERS = true;
const HAND = 5000;
const HANDS = 10;
const PAID_HANDS = 3;
const BID_CAP = 1000;

const JOIN_ERRORS = {
  already_joined: 'คุณเข้าร่วมวงนี้อยู่แล้ว',
  hand_taken: 'มือถูกจับจองแล้ว ลองใหม่อีกครั้ง',
  invalid_invite_code: 'รหัสคำเชิญไม่ถูกต้อง',
  no_member_profile: 'ไม่พบโปรไฟล์สมาชิกของบัญชีนี้',
};

function clock(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m + ':' + String(s).padStart(2, '0');
}

function addBid(bids, b) {
  const list = [b, ...bids];
  const max = Math.max(...list.map((x) => x.amt));
  return list.map((x) => ({ ...x, isTop: x.amt === max }));
}

export default function App() {
  const session = useAuth();
  const [member] = useMember(session?.user?.id);
  const { circles, nextDue, loading: circlesLoading, refresh: refreshCircles } = useCircleData(member?.id);

  const [route, setRoute] = useState('dash');
  const [toast, setToast] = useState('');
  const [live, setLive] = useState({ phase: 'idle', secs: 0, bids: [], fired: 0 });
  const [myBid, setMyBid] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [slipSent, setSlipSent] = useState(false);
  const [form, setForm] = useState({ name: 'วงเพื่อนบ้านสีลม', hand: 3000, hands: 12, type: 'ดอกหัก', fee: 2, frequency: 'รายเดือน', payoutDay: 25, weekday: 1 });
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const [ownerSlips, setOwnerSlips] = useState([]);
  const [ownerSlipsLoading, setOwnerSlipsLoading] = useState(true);

  const toastTimer = useRef(null);

  const showToast = useCallback((t) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3200);
  }, []);

  const refreshOwnerSlips = useCallback(async () => {
    if (!member?.id) {
      setOwnerSlips([]);
      setOwnerSlipsLoading(false);
      return;
    }
    setOwnerSlipsLoading(true);
    const data = await fetchOwnerSlips(member.id);
    setOwnerSlips(data);
    setOwnerSlipsLoading(false);
  }, [member?.id]);

  useEffect(() => {
    refreshOwnerSlips();
  }, [refreshOwnerSlips]);

  const startLive = useCallback(() => {
    setLive({ phase: 'open', secs: BID_SECONDS, bids: [], fired: 0 });
    setMyBid('');
  }, []);

  const goLive = useCallback(() => {
    setRoute('live');
    setLive((cur) => {
      if (cur.phase === 'idle') {
        return { phase: 'open', secs: BID_SECONDS, bids: [], fired: 0 };
      }
      return cur;
    });
  }, []);

  // Live auction countdown + scripted auto-bidders -- see the DEMO banner on
  // the Live page; this is not connected to a real circle yet.
  useEffect(() => {
    const timer = setInterval(() => {
      setLive((L) => {
        if (L.phase !== 'open') return L;
        const dur = BID_SECONDS;
        const secs = L.secs - 1;
        const el = dur - secs;
        let bids = L.bids;
        let fired = L.fired;
        if (AUTO_BIDDERS) {
          while (fired < BID_SCRIPT.length && BID_SCRIPT[fired][0] * dur <= el) {
            const s = BID_SCRIPT[fired];
            bids = addBid(bids, { name: s[1], amt: s[2], t: clock(secs), mine: false });
            fired++;
          }
        }
        if (secs <= 0) {
          setTimeout(() => setLive((st) => ({ ...st, phase: 'winner' })), 1800);
          return { ...L, secs: 0, bids, fired, phase: 'closed' };
        }
        return { ...L, secs, bids, fired };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const top = live.bids.length ? live.bids.reduce((a, b) => (b.amt > a.amt ? b : a)) : null;
  const topAmt = top ? top.amt : 0;
  const receive = PAID_HANDS * HAND + (HANDS - PAID_HANDS - 1) * (HAND - topAmt);

  const submitBid = useCallback(() => {
    const amt = Number(myBid);
    if (live.phase !== 'open') return showToast('รอบเปียปิดรับซองแล้ว');
    if (!amt) return showToast('กรุณาระบุจำนวนดอกที่ต้องการเสนอ');
    if (amt <= topAmt) return showToast('ต้องเสนอดอกสูงกว่า ' + fmt(topAmt));
    if (amt > BID_CAP) return showToast('เพดานดอกของวงนี้คือ ฿1,000 ต่อมือ');
    setLive((L) => ({ ...L, bids: addBid(L.bids, { name: 'คุณ (สมชาย)', amt, t: clock(L.secs), mine: true }) }));
    setMyBid('');
    showToast('ส่งซองเปีย ' + fmt(amt) + ' เรียบร้อย');
  }, [myBid, live.phase, topAmt, showToast]);

  const approveSlip = useCallback(
    async (id) => {
      try {
        await setSlipStatus(id, 'อนุมัติแล้ว');
        showToast('อนุมัติสลิปแล้ว');
        refreshOwnerSlips();
      } catch (err) {
        showToast('อนุมัติไม่สำเร็จ: ' + err.message);
      }
    },
    [showToast, refreshOwnerSlips],
  );

  const rejectSlip = useCallback(
    async (id) => {
      try {
        await setSlipStatus(id, 'ตีกลับ');
        showToast('ตีกลับสลิปแล้ว');
        refreshOwnerSlips();
      } catch (err) {
        showToast('ตีกลับไม่สำเร็จ: ' + err.message);
      }
    },
    [showToast, refreshOwnerSlips],
  );

  const openPay = useCallback(() => {
    setPayOpen(true);
    setSlipSent(false);
  }, []);

  const attachSlip = useCallback(async () => {
    if (!nextDue) return;
    try {
      const { error } = await supabase.from('slips').insert({
        circle_id: nextDue.round.circle.id,
        round_id: nextDue.round_id,
        circle_member_id: nextDue.circle_member_id,
        amount: nextDue.amount_due,
      });
      if (error) throw error;
      setSlipSent(true);
      showToast('ส่งสลิปเรียบร้อย รอท้าวแชร์ตรวจสอบ');
      refreshCircles();
    } catch (err) {
      showToast('ส่งสลิปไม่สำเร็จ: ' + err.message);
    }
  }, [nextDue, showToast, refreshCircles]);

  const createCircle = useCallback(async () => {
    if (!member) return;
    setCreateBusy(true);
    setCreateError('');
    try {
      const circle = await createCircleWithOwner(form, member.id);
      showToast('สร้าง "' + circle.name + '" แล้ว — เปิดหน้าวงเพื่อคัดลอกลิงก์คำเชิญ');
      await refreshCircles();
      setRoute('circle');
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateBusy(false);
    }
  }, [form, member, showToast, refreshCircles]);

  const joinByCode = useCallback(
    async (code) => {
      setJoining(true);
      setJoinError('');
      try {
        const preview = await previewCircleByInviteCode(code);
        if (!preview) throw new Error('ไม่พบวงแชร์สำหรับรหัสนี้');
        const taken = new Set(preview.taken_hands || []);
        let handNo = 1;
        while (taken.has(handNo) && handNo <= preview.hands_count) handNo++;
        if (handNo > preview.hands_count) throw new Error('วงนี้เต็มแล้ว');
        await joinCircleByInviteCode(code, handNo);
        showToast('เข้าร่วมวง "' + preview.name + '" แล้ว');
        await refreshCircles();
      } catch (err) {
        const key = Object.keys(JOIN_ERRORS).find((k) => err.message?.includes(k));
        setJoinError(key ? JOIN_ERRORS[key] : err.message);
      } finally {
        setJoining(false);
      }
    },
    [showToast, refreshCircles],
  );

  if (session === undefined || member === undefined) {
    return null;
  }
  if (session === null) {
    return <Login />;
  }

  const ownedCircles = circles.filter((cm) => cm.role === 'owner').map((cm) => cm.circle);
  const due = nextDue
    ? {
        circle: nextDue.round.circle?.name,
        roundLabel: `งวดที่ ${nextDue.round.round_no}`,
        amount: fmt(nextDue.amount_due),
        dueDate: fmtDate(nextDue.round.due_date),
      }
    : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', gap: 0 }}>
      <Sidebar
        route={route}
        onNavigate={(r) => (r === 'live' ? goLive() : setRoute(r))}
        email={session.user.email}
        onSignOut={() => supabase.auth.signOut()}
      />

      <main style={{ flex: 1, minWidth: 0, padding: '30px 34px 70px', boxSizing: 'border-box', maxWidth: 1160 }}>
        {route === 'dash' && (
          <Dashboard member={member} circles={circles} nextDue={nextDue} loading={circlesLoading} goCreate={() => setRoute('create')} goCircle={() => setRoute('circle')} openPay={openPay} />
        )}
        {route === 'circle' && (
          <Circle
            circles={circles}
            loading={circlesLoading}
            goCreate={() => setRoute('create')}
            goDash={() => setRoute('dash')}
            joinByCode={joinByCode}
            joining={joining}
            joinError={joinError}
          />
        )}
        {route === 'notifications' && <NotificationSettings userId={session.user.id} showToast={showToast} />}
        {route === 'live' && (
          <Live
            phase={live.phase}
            secsLabel={clock(live.secs)}
            barPct={(live.secs / BID_SECONDS) * 100}
            myBid={myBid}
            setMyBid={setMyBid}
            submitBid={submitBid}
            topAmt={topAmt}
            bids={live.bids}
            winner={top}
            receive={receive}
            hand={HAND}
            paidHands={PAID_HANDS}
            hands={HANDS}
            goCircle={() => setRoute('circle')}
            restartLive={startLive}
          />
        )}
        {route === 'create' && <CreateCircle form={form} setForm={setForm} createCircle={createCircle} busy={createBusy} error={createError} />}
        {route === 'owner' && (
          <Owner
            ownedCircles={ownedCircles}
            slips={ownerSlips}
            loading={ownerSlipsLoading}
            approveSlip={approveSlip}
            rejectSlip={rejectSlip}
            remindAll={() => showToast('ฟีเจอร์นี้ยังเป็นตัวอย่าง ยังไม่ส่งการแจ้งเตือนจริง')}
            exportLedger={() => showToast('ฟีเจอร์นี้ยังเป็นตัวอย่าง ยังไม่สร้างไฟล์จริง')}
          />
        )}
      </main>

      <PayModal open={payOpen} due={due} slipSent={slipSent} onClose={() => setPayOpen(false)} onAttachSlip={attachSlip} />
      <Toast message={toast} />
    </div>
  );
}

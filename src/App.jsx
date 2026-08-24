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
import { INITIAL_SLIPS, BID_SCRIPT, fmt } from './data.js';

const BID_SECONDS = 60;
const AUTO_BIDDERS = true;
const HAND = 5000;
const HANDS = 10;
const PAID_HANDS = 3;
const BID_CAP = 1000;

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
  const [route, setRoute] = useState('dash');
  const [toast, setToast] = useState('');
  const [live, setLive] = useState({ phase: 'idle', secs: 0, bids: [], fired: 0 });
  const [myBid, setMyBid] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [slipSent, setSlipSent] = useState(false);
  const [form, setForm] = useState({ name: 'วงเพื่อนบ้านสีลม', hand: 3000, hands: 12, type: 'ดอกหัก', fee: 2, frequency: 'รายเดือน', payoutDay: 25, weekday: 1 });
  const [slips, setSlips] = useState(INITIAL_SLIPS);

  const toastTimer = useRef(null);

  const showToast = useCallback((t) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3200);
  }, []);

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

  // Live auction countdown + scripted auto-bidders, mirrors the original tick().
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
    (id) => {
      setSlips((cur) => cur.map((x) => (x.id === id ? { ...x, status: 'อนุมัติแล้ว' } : x)));
      const s = slips.find((x) => x.id === id);
      if (s) showToast('อนุมัติสลิปของ ' + s.name + ' แล้ว');
    },
    [slips, showToast],
  );

  const rejectSlip = useCallback(
    (id) => {
      setSlips((cur) => cur.map((x) => (x.id === id ? { ...x, status: 'ตีกลับ' } : x)));
      const s = slips.find((x) => x.id === id);
      if (s) showToast('ตีกลับสลิปของ ' + s.name + ' พร้อมแจ้งเหตุผล');
    },
    [slips, showToast],
  );

  const openPay = useCallback(() => {
    setPayOpen(true);
    setSlipSent(false);
  }, []);

  const createCircle = useCallback(() => {
    showToast('สร้าง "' + form.name + '" แล้ว — ส่งคำเชิญให้สมาชิกทางลิงก์');
    setRoute('dash');
  }, [form.name, showToast]);

  if (session === undefined) {
    return null;
  }
  if (session === null) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', gap: 0 }}>
      <Sidebar
        route={route}
        onNavigate={(r) => (r === 'live' ? goLive() : setRoute(r))}
        email={session.user.email}
        onSignOut={() => supabase.auth.signOut()}
      />

      <main style={{ flex: 1, minWidth: 0, padding: '30px 34px 70px', boxSizing: 'border-box', maxWidth: 1160 }}>
        {route === 'dash' && <Dashboard goCreate={() => setRoute('create')} openPay={openPay} />}
        {route === 'circle' && <Circle goCreate={() => setRoute('create')} goDash={() => setRoute('dash')} />}
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
        {route === 'create' && <CreateCircle form={form} setForm={setForm} createCircle={createCircle} />}
        {route === 'owner' && (
          <Owner
            slips={slips}
            approveSlip={approveSlip}
            rejectSlip={rejectSlip}
            remindAll={() => showToast('ส่งการแจ้งเตือนถึงผู้ค้างชำระ 1 รายแล้ว')}
            exportLedger={() => showToast('กำลังจัดทำไฟล์บัญชีวง (PDF) — ส่งเข้าอีเมลของคุณ')}
          />
        )}
      </main>

      <PayModal
        open={payOpen}
        due={null}
        slipSent={slipSent}
        onClose={() => setPayOpen(false)}
        onAttachSlip={() => {
          setSlipSent(true);
          showToast('ส่งสลิปเรียบร้อย รอท้าวแชร์ตรวจสอบ');
        }}
      />
      <Toast message={toast} />
    </div>
  );
}

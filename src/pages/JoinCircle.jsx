import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/useAuth.js';
import { previewCircleByInviteCode, joinCircleByInviteCode } from '../lib/circles.js';
import { Login } from './Login.jsx';
import { Button } from '../components/ui/Button.jsx';
import { BrandMark } from '../components/ui/BrandMark.jsx';
import { fmt } from '../data.js';

const JOIN_ERRORS = {
  already_joined: 'คุณเข้าร่วมวงนี้อยู่แล้ว',
  hand_taken: 'มือนี้มีคนจับจองแล้ว กรุณาเลือกมือหมายเลขอื่น',
  invalid_invite_code: 'ลิงก์คำเชิญนี้ไม่ถูกต้องหรือหมดอายุ',
  invalid_hand_no: 'หมายเลขมือไม่ถูกต้องสำหรับวงนี้',
  circle_full: 'วงนี้มีสมาชิกครบตามจำนวนมือแล้ว',
  no_member_profile: 'ไม่พบโปรไฟล์สมาชิกของบัญชีนี้',
};

function shell(children) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div
        style={{
          width: 400,
          maxWidth: '100%',
          borderRadius: 'var(--radius-2xl)',
          padding: '34px 30px',
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          boxShadow: 'var(--shadow-elevated)',
          animation: 'wj-in .4s var(--ease-brand)',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function JoinCircle({ code }) {
  const session = useAuth();
  const [preview, setPreview] = useState(undefined); // undefined = loading, null = not found
  const [handNo, setHandNo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let cancelled = false;
    previewCircleByInviteCode(code)
      .then((data) => !cancelled && setPreview(data))
      .catch(() => !cancelled && setPreview(null));
    return () => {
      cancelled = true;
    };
  }, [code]);

  const availableHands = useMemo(() => {
    if (!preview) return [];
    const taken = new Set(preview.taken_hands || []);
    const list = [];
    for (let n = 1; n <= preview.hands_count; n++) if (!taken.has(n)) list.push(n);
    return list;
  }, [preview]);

  // สมาชิกที่ยังไม่ระบุมือก็นับเป็นหนึ่งที่นั่งในวง วงจึงเต็มเมื่อจำนวนสมาชิกครบจำนวนมือ
  const isFull = preview ? (preview.members_count ?? 0) >= preview.hands_count : false;

  async function join(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      // handNo = '' → ยังไม่ระบุมือ (null)
      await joinCircleByInviteCode(code, handNo);
      setJoined(true);
    } catch (err) {
      const key = Object.keys(JOIN_ERRORS).find((k) => err.message?.includes(k));
      setError(key ? JOIN_ERRORS[key] : err.message);
    } finally {
      setBusy(false);
    }
  }

  if (preview === undefined) {
    return shell(<div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังตรวจสอบลิงก์คำเชิญ…</div>);
  }

  if (preview === null) {
    return shell(
      <>
        <BrandMark size={48} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginTop: 16 }}>ไม่พบวงแชร์</div>
        <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 8, lineHeight: 1.6 }}>
          ลิงก์คำเชิญนี้ไม่ถูกต้องหรือถูกลบไปแล้ว
        </div>
        <Button variant="ghost" size="sm" pill style={{ marginTop: 16 }} onClick={() => (window.location.hash = '')}>
          กลับหน้าแรก
        </Button>
      </>,
    );
  }

  if (session === undefined) return shell(<div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังโหลด…</div>);

  if (session === null) {
    return (
      <div>
        <div style={{ textAlign: 'center', paddingTop: 24, fontSize: 12.5, color: 'hsl(var(--muted-foreground))' }}>
          เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเข้าร่วม &ldquo;{preview.name}&rdquo;
        </div>
        <Login />
      </div>
    );
  }

  if (joined) {
    return shell(
      <>
        <BrandMark size={48} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginTop: 16 }}>เข้าร่วมวงสำเร็จ 🎉</div>
        <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 8, lineHeight: 1.6 }}>
          คุณเข้าร่วม &ldquo;{preview.name}&rdquo; แล้ว
          {!handNo && <> · ยังไม่ได้ระบุมือ ระบุภายหลังได้ที่หน้า &ldquo;วงของฉัน&rdquo;</>}
        </div>
        <Button variant="gold" pill style={{ marginTop: 18 }} onClick={() => (window.location.hash = '')}>
          ไปที่วงของฉัน
        </Button>
      </>,
    );
  }

  return shell(
    <form onSubmit={join}>
      <BrandMark size={48} />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, marginTop: 16 }}>{preview.name}</div>
      <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 6 }}>
        {fmt(preview.hand_amount)}/งวด · {preview.hands_count} มือ · {preview.bid_type} · {preview.frequency}
      </div>

      {isFull ? (
        <div style={{ fontSize: 13, color: 'hsl(var(--destructive))', marginTop: 20 }}>วงนี้เต็มแล้ว สมาชิกครบตามจำนวนมือ</div>
      ) : (
        <>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 22, textAlign: 'left' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
              เลือกมือที่ต้องการ (ไม่บังคับ)
            </span>
            <select
              value={handNo}
              onChange={(e) => setHandNo(e.target.value)}
              style={{
                height: 44,
                padding: '0 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--secondary)/0.4)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
              }}
            >
              <option value="">ยังไม่ระบุมือ — เลือกภายหลัง</option>
              {availableHands.map((n) => (
                <option key={n} value={n}>
                  มือที่ {n}
                </option>
              ))}
            </select>
            <span style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
              {availableHands.length === 0
                ? 'มือทั้งหมดถูกจองแล้ว แต่ยังเข้าร่วมวงแบบยังไม่ระบุมือได้ แล้วค่อยตกลงกับท้าวแชร์ภายหลัง'
                : 'ถ้ายังไม่รู้ว่าจะรับมือที่เท่าไหร่ ให้เว้นไว้ก่อนได้ แล้วมาระบุทีหลังในหน้า “วงของฉัน”'}
            </span>
          </label>

          {error && <div style={{ fontSize: 12, color: 'hsl(var(--destructive))', marginTop: 12 }}>{error}</div>}

          <Button type="submit" variant="gold" pill disabled={busy} style={{ marginTop: 18, width: '100%' }}>
            {busy ? 'กำลังเข้าร่วม…' : 'เข้าร่วมวง'}
          </Button>
        </>
      )}
    </form>,
  );
}

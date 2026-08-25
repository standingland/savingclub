import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { fetchCircleDetail } from '../lib/circles.js';
import { fmt, fmtDate, handLabel } from '../data.js';

const STATUS_LABEL = { pending: 'รอเปิด', open: 'เปิดรับซอง', closed: 'ปิดรับซองแล้ว', winner_declared: 'ประกาศผลแล้ว', paid: 'จ่ายแล้ว' };

const HAND_ERRORS = {
  hand_taken: 'มือนี้มีคนถือแล้ว กรุณาเลือกมือหมายเลขอื่น',
  invalid_hand_no: 'หมายเลขมือไม่ถูกต้องสำหรับวงนี้',
  not_a_circle_member: 'คุณไม่ได้อยู่ในวงนี้',
  not_authenticated: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
};

function handErrorMessage(err) {
  const key = Object.keys(HAND_ERRORS).find((k) => err.message?.includes(k));
  return key ? HAND_ERRORS[key] : err.message;
}

const selectStyle = {
  height: 38,
  padding: '0 10px',
  borderRadius: 'var(--radius)',
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
};

// ระบุมือของตัวเองภายหลัง — สำหรับคนที่เข้าร่วมวงตอนยังไม่รู้ว่าจะรับมือที่เท่าไหร่
function MyHandCard({ circle, myHandNo, hands, onSave, onSaved }) {
  const [value, setValue] = useState(myHandNo == null ? '' : String(myHandNo));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(myHandNo == null ? '' : String(myHandNo));
  }, [myHandNo]);

  const takenByOthers = new Set(hands.filter((h) => h.hand_no != null && h.hand_no !== myHandNo).map((h) => h.hand_no));
  const options = [];
  for (let n = 1; n <= circle.hands_count; n++) if (!takenByOthers.has(n)) options.push(n);

  const dirty = value !== (myHandNo == null ? '' : String(myHandNo));

  async function save() {
    setBusy(true);
    setError('');
    try {
      await onSave(circle.id, value);
      await onSaved();
    } catch (err) {
      setError(handErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ fontSize: 12.5 }}>
        มือของคุณ: <b>{handLabel(myHandNo)}</b>
      </div>
      <select value={value} onChange={(e) => setValue(e.target.value)} style={selectStyle} disabled={busy}>
        <option value="">ยังไม่ระบุมือ</option>
        {options.map((n) => (
          <option key={n} value={n}>
            มือที่ {n}
          </option>
        ))}
      </select>
      <Button variant="outline" size="sm" pill disabled={busy || !dirty} onClick={save}>
        {busy ? 'กำลังบันทึก…' : 'บันทึกมือ'}
      </Button>
      {myHandNo == null && !error && (
        <span style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))' }}>เลือกได้เมื่อรู้แล้วว่าจะรับมือที่เท่าไหร่</span>
      )}
      {error && <span style={{ fontSize: 11.5, color: 'hsl(var(--destructive))' }}>{error}</span>}
    </div>
  );
}

function CircleDetail({ circleMember, memberId, setMyHandNo, onBack }) {
  const [detail, setDetail] = useState(null);
  const circle = circleMember.circle;

  const load = () => fetchCircleDetail(circle.id).then(setDetail);

  useEffect(() => {
    let cancelled = false;
    fetchCircleDetail(circle.id).then((d) => !cancelled && setDetail(d));
    return () => {
      cancelled = true;
    };
  }, [circle.id]);

  const myHand = detail?.hands.find((h) => h.member_id === memberId);

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: 'hsl(var(--gold))', padding: 0 }}>
        ← วงของฉัน
      </button>
      <h1 style={{ fontSize: 26, marginTop: 10, fontFamily: 'var(--font-body)', fontWeight: 700 }}>{circle.name}</h1>
      <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>
        {fmt(circle.hand_amount)}/งวด · {circle.hands_count} มือ · {circle.bid_type} · {circle.frequency}
      </div>

      {detail && myHand && setMyHandNo && (
        <MyHandCard circle={circle} myHandNo={myHand.hand_no} hands={detail.hands} onSave={setMyHandNo} onSaved={load} />
      )}

      {circleMember.role === 'owner' && (
        <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12.5 }}>
            ลิงก์เชิญเข้าร่วมวง: <b style={{ fontFamily: 'var(--font-mono)' }}>{window.location.origin}{window.location.pathname}#/join/{circle.invite_code}</b>
          </div>
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={() => navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}#/join/${circle.invite_code}`)}
          >
            คัดลอกลิงก์
          </Button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, marginTop: 20, alignItems: 'start' }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>สมาชิกในวง · {detail?.hands.length ?? '—'}</div>
          {!detail ? (
            <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังโหลด…</div>
          ) : (
            detail.hands.map((h) => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid hsl(var(--border)/0.6)', fontSize: 13 }}>
                <span>
                  {handLabel(h.hand_no)} · {h.member?.name}
                </span>
                <span style={{ color: 'hsl(var(--muted-foreground))' }}>{h.role === 'owner' ? 'ท้าวแชร์' : 'ลูกแชร์'}</span>
              </div>
            ))
          )}
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>งวดทั้งหมด · {detail?.rounds.length ?? '—'}</div>
          {!detail ? (
            <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังโหลด…</div>
          ) : (
            detail.rounds.map((r) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid hsl(var(--border)/0.6)', fontSize: 13 }}>
                <span>
                  งวดที่ {r.round_no} · {fmtDate(r.due_date)}
                </span>
                <span style={{ color: 'hsl(var(--muted-foreground))' }}>{r.winner ? `${r.winner.member?.name}` : STATUS_LABEL[r.status] || r.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export function Circle({ circles, loading, goCreate, goDash, joinByCode, joining, joinError, memberId, setMyHandNo }) {
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');

  if (selected) {
    // ใช้ข้อมูลล่าสุดจากรายการวง เผื่อเพิ่งบันทึกมือไป
    const current = circles.find((cm) => cm.id === selected.id) || selected;
    return <CircleDetail circleMember={current} memberId={memberId} setMyHandNo={setMyHandNo} onBack={() => setSelected(null)} />;
  }

  if (loading) {
    return (
      <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
        <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังโหลด…</div>
      </section>
    );
  }

  if (circles.length > 0) {
    return (
      <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
        <h1 style={{ fontSize: 26, fontFamily: 'var(--font-body)', fontWeight: 700 }}>วงของฉัน</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {circles.map((cm) => (
            <button
              key={cm.id}
              onClick={() => setSelected(cm)}
              className="glass-card"
              style={{ borderRadius: 'var(--radius-xl)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{cm.circle?.name}</div>
                <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>
                  {handLabel(cm.hand_no)} · {cm.role === 'owner' ? 'ท้าวแชร์' : 'ลูกแชร์'}
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'hsl(var(--gold))', fontWeight: 600 }}>ดูรายละเอียด →</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <Button variant="outline" size="sm" pill onClick={goCreate}>
            + ตั้งวงใหม่
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div
        className="glass-card"
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: 460,
          margin: '40px auto 0',
        }}
      >
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18 }}>ยังไม่มีวงแชร์ที่เลือก</div>
        <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 8, lineHeight: 1.6 }}>
          ตั้งวงแชร์ใหม่ หรือกรอกรหัสคำเชิญที่ได้รับจากท้าวแชร์เพื่อเข้าร่วมวง
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) joinByCode(code.trim());
          }}
          style={{ display: 'flex', gap: 8, marginTop: 20 }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="รหัสคำเชิญ"
            style={{
              flex: 1,
              height: 40,
              padding: '0 14px',
              borderRadius: 'var(--radius)',
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--secondary)/0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <Button type="submit" variant="outline" size="sm" pill disabled={joining}>
            {joining ? 'กำลังเข้าร่วม…' : 'เข้าร่วมวง'}
          </Button>
        </form>
        {joinError && <div style={{ fontSize: 12, color: 'hsl(var(--destructive))', marginTop: 8 }}>{joinError}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <Button variant="gold" size="sm" pill onClick={goCreate}>
            ตั้งวงใหม่
          </Button>
          <Button variant="ghost" size="sm" pill onClick={goDash}>
            ← กลับแดชบอร์ด
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { ROUNDS, MEMBERS } from '../data.js';

export function Circle({ goLive, openPay }) {
  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
            Circle · WJ-50214
          </div>
          <h1 style={{ fontSize: 28, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            วงทอง 50,000 <Badge variant="gold">ดอกหัก</Badge>
          </h1>
          <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 5 }}>
            ท้าว นภา ทองดี · ฿5,000 × 10 มือ · เปียทุกวันที่ 25 · เริ่ม พ.ค. 2569
          </div>
        </div>
        <Button variant="gold" pill onClick={goLive}>
          เข้าห้องเปียงวดที่ 4
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(310px,1fr))', gap: 14, marginTop: 20, alignItems: 'start' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)',
            background: 'hsl(var(--foreground))',
            color: '#fff',
            padding: 24,
            boxShadow: 'var(--shadow-elevated)',
          }}
        >
          <div style={{ position: 'absolute', bottom: -80, left: -60, width: 210, height: 210, borderRadius: '50%', background: 'var(--pride-aura)', filter: 'blur(48px)', opacity: 0.3 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.65 }}>ค่างวดที่ 4 ของคุณ · ครบ 25 ส.ค.</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: 'hsl(var(--gold))' }}>฿4,650</span>
              <span style={{ fontSize: 11.5, opacity: 0.65 }}>฿5,000 − ดอกหัก ฿350</span>
            </div>
            <div
              style={{
                marginTop: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                padding: '5px 12px',
                borderRadius: 99,
                background: 'hsl(var(--sage)/0.22)',
                color: 'hsl(152 44% 78%)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(var(--sage))' }} />
              ชำระแล้ว · อนุมัติเมื่อวาน 19:22
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '18px 0' }} />
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 'var(--radius)',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,9px)', gap: 2.5 }}>
                  {[0, 1, 0, 1, 0, 1, 0, 1, 0].map((filled, i) => (
                    <span
                      key={i}
                      style={
                        filled
                          ? { width: 9, height: 9, background: '#111827' }
                          : { width: 9, height: 9, border: '2.5px solid #111827', boxSizing: 'border-box' }
                      }
                    />
                  ))}
                </div>
                <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', color: '#6b7280' }}>PROMPTPAY</span>
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>พร้อมเพย์ 08x-xxx-1957 · นภา ทองดี</div>
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>โอนแล้วแนบสลิปในระบบเพื่อยืนยันงวด</div>
                <div style={{ marginTop: 10 }}>
                  <Button variant="gold" size="sm" pill onClick={openPay}>
                    แนบสลิปโอน
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', padding: '12px 0 4px' }}>
            ตารางงวด
          </div>
          {ROUNDS.map((rd, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid hsl(var(--border)/0.5)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{rd.who}</div>
                <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 1 }}>
                  {rd.r} · {rd.bid}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'hsl(var(--gold))' }}>{rd.got}</div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>งวดที่ 4 · 25 ส.ค.</div>
              <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 1 }}>กำลังเปิดรับซองเปีย</div>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '.1em',
                color: 'hsl(var(--destructive))',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(var(--destructive))', animation: 'wj-pulse 1.4s infinite' }} />
              LIVE
            </span>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 12px', marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 0 4px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>สมาชิก · 10 มือ</div>
          <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>สถานะค่างวดที่ 4</div>
        </div>
        {MEMBERS.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid hsl(var(--border)/0.45)' }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'hsl(var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11.5,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'hsl(var(--muted-foreground))',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m.n}</div>
              <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 1 }}>
                {m.role} · {m.bid}
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{m.pay}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

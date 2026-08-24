import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { COLLECT, fmt } from '../data.js';

function collectDot(status) {
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    background: status === 'ชำระแล้ว' ? 'hsl(var(--sage))' : status.startsWith('รอ') ? 'hsl(var(--gold))' : 'hsl(var(--destructive))',
  };
}

export function Owner({ slips, approveSlip, rejectSlip, remindAll, exportLedger }) {
  const pending = slips.filter((s) => s.status === 'รอตรวจ').length;

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
            Organizer · วงครอบครัวบุญมาก
          </div>
          <h1 style={{ fontSize: 28, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700 }}>จัดการวงและตรวจสลิป</h1>
          <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>฿10,000 × 10 มือ · จับฉลาก · งวดที่ 2 จับฉลาก 30 ส.ค. 2569</div>
        </div>
        <Badge variant="gold">รอตรวจ {pending} สลิป</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, marginTop: 20 }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>เก็บเงินงวดนี้แล้ว</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>฿70,000</span>
            <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>/ ฿100,000</span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: 'hsl(var(--secondary))', marginTop: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '70%', borderRadius: 99, background: 'var(--gradient-pride)' }} />
          </div>
        </div>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>สถานะสมาชิก 10 มือ</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 10 }}>
            7 <span style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>ชำระแล้ว</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>รอตรวจ 2 · ค้างชำระ 1</div>
        </div>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>วงที่ดูแลทั้งหมด</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 10 }}>1 <span style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>วง</span></div>
          <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>ตามเพดาน พ.ร.บ. แชร์ ไม่เกิน 3 วง</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14, marginTop: 16, alignItems: 'start' }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', padding: '12px 0 4px' }}>
            สลิปรอตรวจสอบ
          </div>
          {slips.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid hsl(var(--border)/0.5)', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'hsl(var(--secondary))',
                  border: '1px solid hsl(var(--border))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  fontFamily: 'var(--font-mono)',
                  color: 'hsl(var(--muted-foreground))',
                  flexShrink: 0,
                }}
              >
                SLIP
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {s.name} · {fmt(s.amt)}
                </div>
                <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 1 }}>
                  {s.circle} · โอนเมื่อ {s.time}
                </div>
              </div>
              {s.status === 'รอตรวจ' ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button variant="primary" size="sm" pill onClick={() => approveSlip(s.id)}>
                    อนุมัติ
                  </Button>
                  <Button variant="outline" size="sm" pill onClick={() => rejectSlip(s.id)}>
                    ตีกลับ
                  </Button>
                </div>
              ) : (
                <div style={{ fontSize: 12, fontWeight: 700, color: s.status === 'อนุมัติแล้ว' ? 'hsl(var(--sage))' : 'hsl(var(--destructive))' }}>{s.status}</div>
              )}
            </div>
          ))}
          <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', paddingTop: 12 }}>ระบบเทียบยอด เวลาโอน และบัญชีปลายทางกับ PromptPay ของวงอัตโนมัติก่อนถึงมือท้าว</div>
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 0 4px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>สถานะเก็บเงิน · งวดที่ 2</div>
            <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>มือละ ฿10,000</div>
          </div>
          {COLLECT.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid hsl(var(--border)/0.45)' }}>
              <span style={collectDot(c.s)} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{c.n}</div>
              <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))' }}>{c.s}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, paddingTop: 12, flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" pill onClick={remindAll}>
              ส่งเตือนผู้ค้างชำระ
            </Button>
            <Button variant="ghost" size="sm" pill onClick={exportLedger}>
              ดาวน์โหลดบัญชีวง
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

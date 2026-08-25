import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { fmt } from '../data.js';

export function Owner({ ownedCircles, slips, loading, approveSlip, rejectSlip, remindAll, exportLedger }) {
  const pending = slips.filter((s) => s.status === 'รอตรวจ').length;
  const approved = slips.filter((s) => s.status === 'อนุมัติแล้ว');
  const approvedTotal = approved.reduce((sum, s) => sum + Number(s.amount), 0);

  if (loading) {
    return (
      <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
        <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังโหลด…</div>
      </section>
    );
  }

  if (ownedCircles.length === 0) {
    return (
      <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
        <div
          className="glass-card"
          style={{ borderRadius: 'var(--radius-xl)', padding: '48px 24px', textAlign: 'center', maxWidth: 460, margin: '40px auto 0' }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18 }}>คุณยังไม่ได้เป็นท้าวแชร์ของวงใด</div>
          <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 8, lineHeight: 1.6 }}>
            เมื่อคุณตั้งวงแชร์ใหม่ มุมท้าวแชร์สำหรับตรวจสลิปและจัดการวงจะแสดงที่นี่
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
            Organizer
          </div>
          <h1 style={{ fontSize: 28, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700 }}>จัดการวงและตรวจสลิป</h1>
          <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>
            {ownedCircles.map((c) => c.name).join(' · ')}
          </div>
        </div>
        <Badge variant="gold">รอตรวจ {pending} สลิป</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, marginTop: 20 }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>ยอดอนุมัติสะสมทั้งหมด</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 10 }}>{fmt(approvedTotal)}</div>
          <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>จาก {approved.length} สลิปที่อนุมัติแล้ว</div>
        </div>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>สลิปทั้งหมด</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 10 }}>{slips.length}</div>
          <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>
            รอตรวจ {pending} · อนุมัติแล้ว {approved.length} · ตีกลับ {slips.filter((s) => s.status === 'ตีกลับ').length}
          </div>
        </div>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>วงที่ดูแลทั้งหมด</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 10 }}>
            {ownedCircles.length} <span style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>วง</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14, marginTop: 16, alignItems: 'start' }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', padding: '12px 0 4px' }}>
            สลิปที่ได้รับ
          </div>
          {slips.length === 0 ? (
            <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', padding: '16px 0' }}>ยังไม่มีสลิปส่งเข้ามา</div>
          ) : (
            slips.map((s) => (
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
                    {s.circle_member?.member?.name} · {fmt(s.amount)}
                  </div>
                  <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 1 }}>
                    {s.circle?.name}
                    {s.round ? ` · งวดที่ ${s.round.round_no}` : ''} · {new Date(s.transferred_at).toLocaleString('th-TH')}
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
            ))
          )}
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', padding: '12px 0 4px' }}>
            วงที่ดูแล
          </div>
          {ownedCircles.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid hsl(var(--border)/0.45)' }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))' }}>
                {fmt(c.hand_amount)} × {c.hands_count} มือ
              </div>
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
          <div style={{ fontSize: 10.5, color: 'hsl(var(--muted-foreground))', paddingTop: 8, lineHeight: 1.6 }}>
            ฟีเจอร์นี้ยังเป็นตัวอย่าง — ยังไม่เชื่อมระบบส่งข้อความหรือสร้างไฟล์จริง
          </div>
        </div>
      </div>
    </section>
  );
}

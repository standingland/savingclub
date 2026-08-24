import { Button } from '../components/ui/Button.jsx';

export function Circle({ goCreate, goDash }) {
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
          ตั้งวงแชร์ใหม่ หรือรอรับคำเชิญเข้าร่วมวงจากท้าวแชร์ แล้ววงของคุณจะแสดงที่นี่
        </div>
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

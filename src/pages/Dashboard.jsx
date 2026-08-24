import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';

const circleCard = {
  borderRadius: 'var(--radius-xl)',
  padding: 0,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all var(--dur-base) var(--ease-brand)',
};

function CircleCard({ topBar, title, badge, badgeVariant, meta, roundLabel, statusLabel, statusColor, progress, onClick }) {
  return (
    <div
      className="glass-card"
      style={circleCard}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
        e.currentTarget.style.borderColor = 'hsl(var(--gold)/0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = '';
      }}
    >
      <div style={{ height: 3, background: topBar }} />
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16.5 }}>{title}</div>
          <Badge variant={badgeVariant}>{badge}</Badge>
        </div>
        <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>{meta}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 14 }}>
          <span>{roundLabel}</span>
          <span style={{ color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: 'hsl(var(--secondary))', marginTop: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, borderRadius: 99, background: 'var(--gradient-pride)' }} />
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ goCircle, goLive, goOwner, goCreate, openPay }) {
  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
            Overview · 18 ส.ค. 2569
          </div>
          <h1 style={{ fontSize: 30, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.01em' }}>สวัสดี คุณสมชาย</h1>
        </div>
        <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))' }}>
          รอบชำระถัดไป <b style={{ color: 'hsl(var(--foreground))' }}>25 ส.ค. 2569</b>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14, marginTop: 20, alignItems: 'stretch' }}>
        <div
          style={{
            gridColumn: 'span 1',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)',
            background: 'hsl(var(--foreground))',
            color: '#fff',
            padding: 26,
            boxShadow: 'var(--shadow-elevated)',
          }}
        >
          <div style={{ position: 'absolute', top: -70, right: -70, width: 220, height: 220, borderRadius: '50%', background: 'var(--pride-aura)', filter: 'blur(46px)', opacity: 0.35 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.65 }}>ยอดต้องชำระเดือนนี้</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 12, color: 'hsl(var(--gold))' }}>฿7,150</div>
            <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 8 }}>2 วง · ครบกำหนด 25 ส.ค. · โอนแล้วแนบสลิปได้ทันที</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
              <Button variant="gold" size="sm" pill onClick={openPay}>
                ชำระตอนนี้
              </Button>
              <Button
                variant="outline"
                size="sm"
                pill
                onClick={goCircle}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
              >
                ดูรายละเอียด
              </Button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>มูลค่าวงที่ร่วม</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 10 }}>฿170,000</div>
              <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>3 วง · 28 สมาชิก</div>
            </div>
          </div>
          <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>รับก้อนโดยประมาณ</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 10, color: 'hsl(var(--gold))' }}>฿42,900</div>
              <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>หากเปียได้งวดนี้</div>
            </div>
          </div>
          <div
            className="glass-card"
            style={{
              gridColumn: '1/-1',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              border: '1px solid hsl(var(--gold)/0.4)',
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'hsl(var(--destructive))', animation: 'wj-pulse 1.4s infinite', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>วงทอง 50,000 — เปิดรับซองงวดที่ 4</div>
              <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))' }}>ดอกสูงสุดได้รับเงินก้อนงวดนี้</div>
            </div>
            <Button variant="primary" size="sm" pill onClick={goLive}>
              เข้าห้องเปีย
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 30 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>วงแชร์ของฉัน · 3</div>
        <button onClick={goCreate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'hsl(var(--gold))' }}>
          + ตั้งวงใหม่
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 14, marginTop: 12, alignItems: 'stretch' }}>
        <CircleCard
          topBar="var(--gradient-pride)"
          title="วงทอง 50,000"
          badge="ดอกหัก"
          badgeVariant="gold"
          meta="ท้าว นภา ทองดี · ฿5,000 × 10 มือ"
          roundLabel="งวด 4/10"
          statusLabel="ชำระแล้ว"
          statusColor="hsl(var(--sage))"
          progress={40}
          onClick={goCircle}
        />
        <CircleCard
          topBar="hsl(var(--secondary))"
          title="วงออฟฟิศสีลม"
          badge="ดอกตาม"
          badgeVariant="neutral"
          meta="ท้าว ธนา กิจดี · ฿2,500 × 8 มือ"
          roundLabel="งวด 6/8"
          statusLabel="ครบกำหนด 25 ส.ค."
          statusColor="hsl(var(--destructive))"
          progress={75}
          onClick={openPay}
        />
        <CircleCard
          topBar="hsl(var(--secondary))"
          title="วงครอบครัวบุญมาก"
          badge="คุณเป็นท้าว"
          badgeVariant="solid"
          meta="฿10,000 × 10 มือ · จับฉลาก"
          roundLabel="งวด 2/10"
          statusLabel="เก็บแล้ว 7/10"
          statusColor="hsl(var(--muted-foreground))"
          progress={20}
          onClick={goOwner}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14, marginTop: 16, alignItems: 'start' }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', padding: '12px 0 4px' }}>
            กิจกรรมล่าสุด
          </div>
          {[
            { dot: 'hsl(var(--destructive))', text: <>ค่างวด <b>วงออฟฟิศสีลม</b> ฿2,500 ครบกำหนดใน 7 วัน</>, time: '08:00' },
            { dot: 'hsl(var(--sage))', text: <>สลิปงวดที่ 4 <b>วงทอง 50,000</b> อนุมัติแล้ว</>, time: '19:22' },
            { dot: 'hsl(var(--gold))', text: <><b>วงทอง 50,000</b> เปิดรับซองเปียงวดที่ 4</>, time: '18:00', noBorder: true },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 0',
                borderBottom: item.noBorder ? 'none' : '1px solid hsl(var(--border)/0.5)',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13 }}>{item.text}</div>
              <span style={{ fontSize: 10.5, color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              position: 'relative',
              width: 88,
              height: 88,
              flexShrink: 0,
              borderRadius: '50%',
              background: 'conic-gradient(hsl(var(--gold)) 0 352.8deg, hsl(var(--secondary)) 352.8deg 360deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'hsl(var(--card))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>98</span>
              <span style={{ fontSize: 8.5, color: 'hsl(var(--muted-foreground))' }}>/100</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>คะแนนความน่าเชื่อถือ</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 5 }}>ระดับดีเยี่ยม</div>
            <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3, lineHeight: 1.6 }}>
              ชำระตรงเวลา 24 งวดติดต่อกัน · ใช้ประกอบการรับเข้าวงใหม่และเพดานวงเงิน
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

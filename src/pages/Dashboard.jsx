import { Button } from '../components/ui/Button.jsx';
import { fmt, fmtDate } from '../data.js';

export function Dashboard({ member, circles, nextDue, loading, goCreate, goCircle, openPay }) {
  const hasCircles = circles.length > 0;

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
            Overview
          </div>
          <h1 style={{ fontSize: 30, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: '-0.01em' }}>
            สวัสดี{member?.name ? ` ${member.name}` : ''}
          </h1>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-2xl)',
          background: 'hsl(var(--foreground))',
          color: '#fff',
          padding: 26,
          boxShadow: 'var(--shadow-elevated)',
          marginTop: 20,
        }}
      >
        <div style={{ position: 'absolute', top: -70, right: -70, width: 220, height: 220, borderRadius: '50%', background: 'var(--pride-aura)', filter: 'blur(46px)', opacity: 0.35 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.65 }}>ยอดต้องชำระ</div>
          {loading ? (
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, marginTop: 12 }}>กำลังโหลด…</div>
          ) : nextDue ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 12 }}>
                {fmt(nextDue.amount_due)}
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 8 }}>
                {nextDue.round.circle?.name} · งวดที่ {nextDue.round.round_no} · ครบกำหนด {fmtDate(nextDue.round.due_date)}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 12 }}>ยังไม่มีรายการที่ต้องชำระ</div>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 8 }}>เริ่มต้นด้วยการตั้งวงแชร์ของคุณเอง หรือรอรับคำเชิญจากท้าวแชร์</div>
            </>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            <Button variant="gold" size="sm" pill onClick={goCreate}>
              ตั้งวงใหม่
            </Button>
            <Button
              variant="outline"
              size="sm"
              pill
              onClick={openPay}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
            >
              ดูรายการที่ต้องชำระ
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 30 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
          วงแชร์ของฉัน · {circles.length}
        </div>
        <button onClick={goCreate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'hsl(var(--gold))' }}>
          + ตั้งวงใหม่
        </button>
      </div>

      {hasCircles ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {circles.map((cm) => (
            <button
              key={cm.id}
              onClick={goCircle}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-xl)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{cm.circle?.name}</div>
                <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>
                  มือที่ {cm.hand_no} · {cm.role === 'owner' ? 'ท้าวแชร์' : 'ลูกแชร์'} · {fmt(cm.circle?.hand_amount)}/งวด
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>{cm.circle?.hands_count} มือ</div>
            </button>
          ))}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '36px 20px',
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>{loading ? 'กำลังโหลด…' : 'ยังไม่มีวงแชร์'}</div>
          {!loading && (
            <>
              <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 6, maxWidth: 360, margin: '6px auto 0', lineHeight: 1.6 }}>
                เมื่อคุณตั้งวงแชร์ใหม่หรือเข้าร่วมวงที่มีอยู่ วงแชร์ของคุณจะแสดงที่นี่
              </div>
              <div style={{ marginTop: 16 }}>
                <Button variant="outline" size="sm" pill onClick={goCreate}>
                  ตั้งวงใหม่
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14, marginTop: 16, alignItems: 'start' }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '8px 20px 12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', padding: '12px 0 4px' }}>
            กิจกรรมล่าสุด
          </div>
          <div style={{ padding: '20px 0', fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>ยังไม่มีกิจกรรม</div>
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              position: 'relative',
              width: 88,
              height: 88,
              flexShrink: 0,
              borderRadius: '50%',
              background: 'hsl(var(--secondary))',
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
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, lineHeight: 1, color: 'hsl(var(--muted-foreground))' }}>
                {member?.credit_score ?? '—'}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>คะแนนความน่าเชื่อถือ</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 5 }}>{member?.credit_score != null ? `${member.credit_score}/100` : 'ยังไม่มีคะแนน'}</div>
            <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 3, lineHeight: 1.6 }}>
              {member?.verified ? 'ยืนยันตัวตนแล้ว' : 'คะแนนจะเริ่มคำนวณเมื่อคุณชำระค่างวดงวดแรก'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { BrandMark } from '../components/ui/BrandMark.jsx';
import { Button } from '../components/ui/Button.jsx';

export function Login({ phone, setPhone, onEnter }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: -140, right: -120, width: 420, height: 420, borderRadius: '50%', background: 'var(--pride-aura)', filter: 'blur(90px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: -160, left: -120, width: 380, height: 380, borderRadius: '50%', background: 'var(--pride-aura)', filter: 'blur(90px)', opacity: 0.25 }} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onEnter();
        }}
        style={{
          position: 'relative',
          width: 380,
          maxWidth: '100%',
          borderRadius: 'var(--radius-2xl)',
          padding: '34px 30px',
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          boxShadow: 'var(--shadow-elevated)',
          animation: 'wj-in .4s var(--ease-brand)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BrandMark size={58} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 23, marginTop: 16, letterSpacing: '-0.01em' }}>Saving Money Club</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', marginTop: 5 }}>
            Share Circle OS
          </div>
          <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 14, lineHeight: 1.7 }}>
            จัดการวงแชร์ ชำระค่างวด และแนบสลิปโอนเงินได้ในที่เดียว
          </div>
        </div>

        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
              เบอร์โทรศัพท์
            </span>
            <input
              type="tel"
              placeholder="08x-xxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                height: 46,
                padding: '0 14px',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--secondary)/0.4)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'hsl(var(--foreground))',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </label>
          <Button type="submit" variant="gold" pill style={{ marginTop: 4 }}>
            เข้าสู่ระบบ
          </Button>
          <Button type="button" variant="outline" pill onClick={onEnter}>
            เข้าสู่ระบบด้วย LINE
          </Button>
        </div>

        <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', textAlign: 'center', marginTop: 18, lineHeight: 1.7 }}>
          การเข้าสู่ระบบถือว่ายอมรับข้อตกลงการใช้งาน Saving Money Club
        </div>
      </form>
    </div>
  );
}

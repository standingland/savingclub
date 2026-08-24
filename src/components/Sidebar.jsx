import { BrandMark } from './ui/BrandMark.jsx';

const NAV_ITEMS = [
  { id: 'dash', label: 'แดชบอร์ด', dotColor: 'hsl(var(--gold))' },
  { id: 'circle', label: 'วงของฉัน', dotColor: 'hsl(var(--gold))' },
  { id: 'live', label: 'ห้องเปียสด', dotColor: 'hsl(var(--destructive))', pulse: true },
  { id: 'create', label: 'ตั้งวงใหม่', dotColor: 'hsl(var(--gold))' },
  { id: 'owner', label: 'มุมท้าวแชร์', dotColor: 'hsl(var(--gold))' },
  { id: 'notifications', label: 'การแจ้งเตือน', dotColor: 'hsl(var(--gold))' },
];

const navButtonStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  border: 'none',
  cursor: 'pointer',
  padding: '11px 14px',
  borderRadius: 'var(--radius)',
  background: active ? 'hsl(var(--sidebar-primary))' : 'transparent',
  color: active ? 'hsl(var(--sidebar-primary-foreground))' : 'hsl(var(--muted-foreground))',
  fontFamily: 'var(--font-body)',
  fontSize: 13.5,
  fontWeight: active ? 600 : 500,
  textAlign: 'left',
  boxShadow: active ? 'var(--shadow-soft)' : 'none',
});

export function Sidebar({ route, onNavigate, email, onSignOut }) {
  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '22px 14px',
        background: 'hsl(var(--sidebar-background)/0.78)',
        backdropFilter: 'blur(18px)',
        borderRight: '1px solid hsl(var(--sidebar-border))',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 10px 16px', cursor: 'pointer' }}
        onClick={() => onNavigate('dash')}
      >
        <BrandMark size={36} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, lineHeight: 1.15 }}>Saving Money Club</div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'hsl(var(--muted-foreground))',
              marginTop: 3,
            }}
          >
            Share Circle OS
          </div>
        </div>
      </div>

      {NAV_ITEMS.map((item) => {
        const active = route === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={navButtonStyle(active)}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = 'hsl(var(--sidebar-accent))';
              if (!active) e.currentTarget.style.color = 'hsl(var(--foreground))';
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = 'transparent';
              if (!active) e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: active ? item.dotColor : 'hsl(var(--border))',
                animation: active && item.pulse ? 'wj-pulse 1.4s infinite' : undefined,
              }}
            />
            {item.label}
          </button>
        );
      })}

      <div style={{ marginTop: 'auto' }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'hsl(var(--foreground))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ส
            </div>
            <div style={{ minWidth: 0, lineHeight: 1.2 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>
              <div style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))' }}>ยังไม่ยืนยันตัวตน</div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              fontSize: 10.5,
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            <span>เครดิต</span>
            <b style={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>ยังไม่มีคะแนน</b>
          </div>
          <div
            style={{
              height: 4,
              borderRadius: 99,
              background: 'hsl(var(--secondary))',
              marginTop: 5,
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '100%', width: '0%', borderRadius: 99, background: 'hsl(var(--gold))' }} />
          </div>
          <button
            onClick={onSignOut}
            style={{
              width: '100%',
              marginTop: 10,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              color: 'hsl(var(--destructive))',
              textAlign: 'left',
            }}
          >
            ออกจากระบบ
          </button>
        </div>
        <a
          href="#/admin"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'hsl(var(--muted-foreground))',
            textDecoration: 'none',
          }}
        >
          หลังบ้าน →
        </a>
      </div>
    </aside>
  );
}

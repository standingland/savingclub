import { useState } from 'react';
import { BrandMark } from '../components/ui/BrandMark.jsx';
import { DashboardTab } from './DashboardTab.jsx';
import { MembersTab } from './MembersTab.jsx';
import { CirclesTab } from './CirclesTab.jsx';
import { SlipsTab } from './SlipsTab.jsx';

const TABS = [
  { id: 'dashboard', label: 'แดชบอร์ด', Component: DashboardTab },
  { id: 'circles', label: 'วงแชร์', Component: CirclesTab },
  { id: 'members', label: 'สมาชิก', Component: MembersTab },
  { id: 'slips', label: 'สลิป', Component: SlipsTab },
];

export function AdminApp() {
  const [tab, setTab] = useState('dashboard');
  const Active = TABS.find((t) => t.id === tab).Component;

  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '18px 28px',
          borderBottom: '1px solid hsl(var(--border))',
          background: 'hsl(var(--sidebar-background)/0.9)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={30} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>Saving Money Club · หลังบ้าน</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', marginTop: 3 }}>
              Back Office
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                background: tab === t.id ? 'hsl(var(--foreground))' : 'transparent',
                color: tab === t.id ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <a href="#/" style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: 'hsl(var(--gold))', textDecoration: 'none' }}>
          ← กลับหน้าแอป
        </a>
      </header>

      <main style={{ padding: 28, maxWidth: 1200, margin: '0 auto' }}>
        <Active />
      </main>
    </div>
  );
}

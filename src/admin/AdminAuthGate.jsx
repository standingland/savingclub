import { useEffect, useState } from 'react';
import { useAuth } from '../lib/useAuth.js';
import { supabase } from '../lib/supabase.js';
import { Login } from '../pages/Login.jsx';
import { Button } from '../components/ui/Button.jsx';
import { BrandMark } from '../components/ui/BrandMark.jsx';

// The passcode screen in AdminGate is just UX friction to keep casual users
// out of the URL. The real gate is here: a signed-in Supabase session whose
// profile has role = 'admin' -- which is also what every RLS policy in the
// database checks, so a non-admin session simply can't read or write the
// back-office tables even if this component were bypassed.
export function AdminAuthGate({ children }) {
  const session = useAuth();
  const [role, setRole] = useState(undefined);

  useEffect(() => {
    if (!session) {
      setRole(undefined);
      return;
    }
    let cancelled = false;
    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setRole(data?.role ?? 'member');
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  if (session === undefined) return null;
  if (session === null) return <Login />;
  if (role === undefined) return null;

  if (role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div
          style={{
            maxWidth: 360,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            padding: 28,
            borderRadius: 'var(--radius-2xl)',
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            boxShadow: 'var(--shadow-elevated)',
          }}
        >
          <BrandMark size={40} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ</div>
          <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
            เข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบเพื่อเข้าใช้งานหลังบ้าน
          </div>
          <Button variant="outline" size="sm" pill onClick={() => supabase.auth.signOut()}>
            ออกจากระบบ
          </Button>
        </div>
      </div>
    );
  }

  return children;
}

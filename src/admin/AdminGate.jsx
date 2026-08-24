import { useState } from 'react';
import { BrandMark } from '../components/ui/BrandMark.jsx';
import { Button } from '../components/ui/Button.jsx';
import { field } from './adminStyles.js';

const PASSCODE = '1111';
const SESSION_KEY = 'saving-money-club-admin-unlocked';

export function AdminGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  if (unlocked) return children;

  function submit(e) {
    e.preventDefault();
    if (value === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <form
        onSubmit={submit}
        style={{
          width: 320,
          maxWidth: '100%',
          borderRadius: 'var(--radius-xl)',
          padding: 28,
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          boxShadow: 'var(--shadow-elevated)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}
      >
        <BrandMark size={40} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Saving Money Club · หลังบ้าน</div>
          <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>กรอกรหัสผ่านเพื่อเข้าใช้งาน</div>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          style={{ ...field, textAlign: 'center', letterSpacing: '0.3em', fontSize: 18 }}
          placeholder="••••"
        />
        {error && <div style={{ fontSize: 12, color: 'hsl(var(--destructive))' }}>รหัสผ่านไม่ถูกต้อง</div>}
        <Button type="submit" variant="primary" size="sm" block>
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  );
}

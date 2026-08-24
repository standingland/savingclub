import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Button } from '../components/ui/Button.jsx';

const ROW = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '14px 0',
  borderBottom: '1px solid hsl(var(--border)/0.6)',
};

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 44,
        height: 26,
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: 'pointer',
        padding: 3,
        background: on ? 'hsl(var(--gold))' : 'hsl(var(--secondary))',
        display: 'flex',
        justifyContent: on ? 'flex-end' : 'flex-start',
        transition: 'background var(--dur-fast)',
        flexShrink: 0,
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-soft)' }} />
    </button>
  );
}

const TOGGLE_ITEMS = [
  { key: 'notify_due_soon', title: 'ใกล้ครบกำหนดชำระ', subtitle: 'แจ้งเตือนก่อนถึงวันครบกำหนดค่างวด' },
  { key: 'notify_round_open', title: 'เปิดรับซองเปียใหม่', subtitle: 'แจ้งเมื่อวงของคุณเปิดรับซองเปียงวดใหม่' },
  { key: 'notify_slip_approved', title: 'สลิปได้รับการตรวจแล้ว', subtitle: 'แจ้งเมื่อท้าวแชร์อนุมัติหรือตีกลับสลิปของคุณ' },
  { key: 'notify_live_auction', title: 'ห้องเปียสดเริ่มแล้ว', subtitle: 'แจ้งเมื่อห้องประมูลดอกของวงคุณเปิดใช้งาน' },
];

export function NotificationSettings({ userId, showToast }) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase.from('notification_settings').select('*').eq('user_id', userId).maybeSingle();
      if (cancelled) return;
      if (!error && data) setSettings(data);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from('notification_settings')
      .update({
        remind_days_before: settings.remind_days_before,
        notify_due_soon: settings.notify_due_soon,
        notify_round_open: settings.notify_round_open,
        notify_slip_approved: settings.notify_slip_approved,
        notify_live_auction: settings.notify_live_auction,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    setSaving(false);
    if (error) return showToast('บันทึกไม่สำเร็จ: ' + error.message);
    showToast('บันทึกการตั้งค่าการแจ้งเตือนแล้ว');
  }

  if (loading || !settings) {
    return (
      <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
        <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังโหลด…</div>
      </section>
    );
  }

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
        Settings
      </div>
      <h1 style={{ fontSize: 28, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700 }}>การแจ้งเตือนของฉัน</h1>
      <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>เลือกสิ่งที่คุณอยากให้ระบบแจ้งเตือน — บันทึกไว้เฉพาะบัญชีของคุณ</div>

      <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: '4px 20px', marginTop: 20, maxWidth: 520 }}>
        {TOGGLE_ITEMS.map((item) => (
          <div key={item.key} style={ROW}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 2 }}>{item.subtitle}</div>
            </div>
            <Toggle on={settings[item.key]} onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })} />
          </div>
        ))}

        <div style={{ ...ROW, borderBottom: 'none' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>แจ้งเตือนล่วงหน้ากี่วัน</div>
            <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 2 }}>ใช้กับการแจ้งเตือน "ใกล้ครบกำหนดชำระ"</div>
          </div>
          <input
            type="number"
            min={0}
            max={14}
            value={settings.remind_days_before}
            onChange={(e) => setSettings({ ...settings, remind_days_before: Number(e.target.value) })}
            style={{
              width: 64,
              height: 38,
              textAlign: 'center',
              borderRadius: 'var(--radius)',
              border: '1px solid hsl(var(--input))',
              background: 'hsl(var(--card))',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'hsl(var(--foreground))',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button variant="gold" pill onClick={save} disabled={saving}>
          {saving ? 'กำลังบันทึก…' : 'บันทึกการตั้งค่า'}
        </Button>
      </div>
    </section>
  );
}

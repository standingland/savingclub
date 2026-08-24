import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Button } from '../components/ui/Button.jsx';
import { card, field, th, td } from './adminStyles.js';
import { Field } from './Field.jsx';

const EMPTY = { name: '', phone: '', promptpay_id: '' };

export function MembersTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from('members').select('*').order('created_at');
    if (error) setError(error.message);
    else setMembers(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addMember(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError('');
    const { error } = await supabase.from('members').insert({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      promptpay_id: form.promptpay_id.trim() || null,
    });
    if (error) return setError(error.message);
    setForm(EMPTY);
    load();
  }

  async function toggleVerified(m) {
    await supabase.from('members').update({ verified: !m.verified }).eq('id', m.id);
    load();
  }

  async function remove(id) {
    await supabase.from('members').delete().eq('id', id);
    load();
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
      <form onSubmit={addMember} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>เพิ่มสมาชิก</div>
        <Field label="ชื่อ-นามสกุล">
          <input style={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="เบอร์โทร">
          <input style={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="พร้อมเพย์">
          <input style={field} value={form.promptpay_id} onChange={(e) => setForm({ ...form, promptpay_id: e.target.value })} />
        </Field>
        {error && <div style={{ fontSize: 12, color: 'hsl(var(--destructive))' }}>{error}</div>}
        <Button type="submit" variant="primary" size="sm">
          เพิ่มสมาชิก
        </Button>
      </form>

      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>สมาชิกทั้งหมด · {members.length}</div>
        {loading ? (
          <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>กำลังโหลด…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>ชื่อ</th>
                  <th style={th}>เบอร์โทร</th>
                  <th style={th}>เครดิต</th>
                  <th style={th}>ยืนยันตัวตน</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td style={td}>{m.name}</td>
                    <td style={td}>{m.phone || '—'}</td>
                    <td style={td}>{m.credit_score}/100</td>
                    <td style={td}>
                      <button
                        onClick={() => toggleVerified(m)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          background: 'transparent',
                          fontSize: 12,
                          fontWeight: 600,
                          color: m.verified ? 'hsl(var(--sage))' : 'hsl(var(--muted-foreground))',
                        }}
                      >
                        {m.verified ? '✓ ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                      </button>
                    </td>
                    <td style={td}>
                      <button
                        onClick={() => remove(m.id)}
                        style={{ border: 'none', cursor: 'pointer', background: 'transparent', fontSize: 12, color: 'hsl(var(--destructive))' }}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td style={td} colSpan={5}>
                      ยังไม่มีสมาชิก
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

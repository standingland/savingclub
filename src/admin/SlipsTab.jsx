import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Button } from '../components/ui/Button.jsx';
import { card, field, th, td } from './adminStyles.js';
import { Field } from './Field.jsx';

const EMPTY = { circle_id: '', circle_member_id: '', round_id: '', amount: '' };

export function SlipsTab() {
  const [slips, setSlips] = useState([]);
  const [circles, setCircles] = useState([]);
  const [circleMembers, setCircleMembers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  async function loadSlips() {
    const { data } = await supabase
      .from('slips')
      .select('*, circle:circle_id(name), circle_member:circle_member_id(member:member_id(name)), round:round_id(round_no)')
      .order('created_at', { ascending: false });
    setSlips(data || []);
  }

  async function loadCircles() {
    const { data } = await supabase.from('circles').select('id, name').order('name');
    setCircles(data || []);
  }

  useEffect(() => {
    loadSlips();
    loadCircles();
  }, []);

  async function onCircleChange(circleId) {
    setForm({ ...form, circle_id: circleId, circle_member_id: '', round_id: '' });
    if (!circleId) {
      setCircleMembers([]);
      setRounds([]);
      return;
    }
    const [{ data: cm }, { data: rd }] = await Promise.all([
      supabase.from('circle_members').select('id, member:member_id(name)').eq('circle_id', circleId),
      supabase.from('rounds').select('id, round_no').eq('circle_id', circleId).order('round_no'),
    ]);
    setCircleMembers(cm || []);
    setRounds(rd || []);
  }

  async function addSlip(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.from('slips').insert({
      circle_id: form.circle_id,
      circle_member_id: form.circle_member_id,
      round_id: form.round_id || null,
      amount: Number(form.amount),
    });
    if (error) return setError(error.message);
    setForm(EMPTY);
    setCircleMembers([]);
    setRounds([]);
    loadSlips();
  }

  async function setStatus(id, status) {
    await supabase.from('slips').update({ status }).eq('id', id);
    loadSlips();
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
      <form onSubmit={addSlip} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>บันทึกสลิปโอนเงิน</div>
        <Field label="วงแชร์">
          <select style={field} value={form.circle_id} onChange={(e) => onCircleChange(e.target.value)} required>
            <option value="">— เลือกวง —</option>
            {circles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="สมาชิก (มือ)">
          <select style={field} value={form.circle_member_id} onChange={(e) => setForm({ ...form, circle_member_id: e.target.value })} required disabled={!form.circle_id}>
            <option value="">— เลือก —</option>
            {circleMembers.map((cm) => (
              <option key={cm.id} value={cm.id}>
                {cm.member?.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="งวด (ถ้ามี)">
          <select style={field} value={form.round_id} onChange={(e) => setForm({ ...form, round_id: e.target.value })} disabled={!form.circle_id}>
            <option value="">— ไม่ระบุ —</option>
            {rounds.map((r) => (
              <option key={r.id} value={r.id}>
                งวดที่ {r.round_no}
              </option>
            ))}
          </select>
        </Field>
        <Field label="จำนวนเงิน (บาท)">
          <input style={field} inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </Field>
        {error && <div style={{ fontSize: 12, color: 'hsl(var(--destructive))' }}>{error}</div>}
        <Button type="submit" variant="primary" size="sm">
          บันทึกสลิป
        </Button>
      </form>

      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>สลิปทั้งหมด · {slips.length}</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>วง</th>
                <th style={th}>สมาชิก</th>
                <th style={th}>งวด</th>
                <th style={th}>จำนวนเงิน</th>
                <th style={th}>สถานะ</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {slips.map((s) => (
                <tr key={s.id}>
                  <td style={td}>{s.circle?.name}</td>
                  <td style={td}>{s.circle_member?.member?.name}</td>
                  <td style={td}>{s.round ? `#${s.round.round_no}` : '—'}</td>
                  <td style={td}>฿{Number(s.amount).toLocaleString()}</td>
                  <td
                    style={{
                      ...td,
                      color: s.status === 'อนุมัติแล้ว' ? 'hsl(var(--sage))' : s.status === 'ตีกลับ' ? 'hsl(var(--destructive))' : 'hsl(var(--gold))',
                      fontWeight: 600,
                    }}
                  >
                    {s.status}
                  </td>
                  <td style={td}>
                    {s.status === 'รอตรวจ' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setStatus(s.id, 'อนุมัติแล้ว')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'hsl(var(--sage))', fontWeight: 600 }}>
                          อนุมัติ
                        </button>
                        <button onClick={() => setStatus(s.id, 'ตีกลับ')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'hsl(var(--destructive))', fontWeight: 600 }}>
                          ตีกลับ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {slips.length === 0 && (
                <tr>
                  <td style={td} colSpan={6}>
                    ยังไม่มีสลิป
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Button } from '../components/ui/Button.jsx';
import { card, field, th, td } from './adminStyles.js';
import { Field } from './Field.jsx';

const EMPTY_CIRCLE = {
  name: '',
  hand_amount: '',
  hands_count: '',
  bid_type: 'ดอกหัก',
  fee_percent: '2',
  frequency: 'รายเดือน',
  payout_day: '25',
  payout_weekday: '1',
  start_date: '',
  owner_member_id: '',
};
const BID_TYPES = ['ดอกหัก', 'ดอกตาม', 'เปียประมูลดอก', 'จับฉลาก'];
const FREQUENCIES = ['รายวัน', 'รายสัปดาห์', 'รายเดือน'];
const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

function scheduleLabel(c) {
  if (c.frequency === 'รายวัน') return 'เก็บทุกวัน';
  if (c.frequency === 'รายสัปดาห์') return `เก็บทุกสัปดาห์ · วัน${WEEKDAYS[c.payout_weekday ?? 1]}`;
  return `เก็บทุกวันที่ ${c.payout_day ?? 25} ของเดือน`;
}

export function CirclesTab() {
  const [circles, setCircles] = useState([]);
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [circleMembers, setCircleMembers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [form, setForm] = useState(EMPTY_CIRCLE);
  const [handForm, setHandForm] = useState({ member_id: '', hand_no: '', role: 'member' });
  const [roundForm, setRoundForm] = useState({ round_no: '', due_date: '', status: 'pending' });
  const [error, setError] = useState('');

  async function loadCircles() {
    const { data } = await supabase.from('circles').select('*, owner:owner_member_id(name)').order('created_at');
    setCircles(data || []);
  }

  async function loadMembers() {
    const { data } = await supabase.from('members').select('id, name').order('name');
    setMembers(data || []);
  }

  async function loadCircleDetail(circleId) {
    const [{ data: cm }, { data: rd }] = await Promise.all([
      supabase.from('circle_members').select('*, member:member_id(name)').eq('circle_id', circleId).order('hand_no'),
      supabase.from('rounds').select('*').eq('circle_id', circleId).order('round_no'),
    ]);
    setCircleMembers(cm || []);
    setRounds(rd || []);
  }

  useEffect(() => {
    loadCircles();
    loadMembers();
  }, []);

  useEffect(() => {
    if (selected) loadCircleDetail(selected.id);
  }, [selected?.id]);

  async function addCircle(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.from('circles').insert({
      name: form.name.trim(),
      hand_amount: Number(form.hand_amount),
      hands_count: Number(form.hands_count),
      bid_type: form.bid_type,
      fee_percent: Number(form.fee_percent) || 0,
      frequency: form.frequency,
      payout_day: form.frequency === 'รายเดือน' ? Number(form.payout_day) || 25 : null,
      payout_weekday: form.frequency === 'รายสัปดาห์' ? Number(form.payout_weekday) : null,
      start_date: form.start_date || null,
      owner_member_id: form.owner_member_id || null,
    });
    if (error) return setError(error.message);
    setForm(EMPTY_CIRCLE);
    loadCircles();
  }

  async function addHand(e) {
    e.preventDefault();
    if (!selected) return;
    setError('');
    const { error } = await supabase.from('circle_members').insert({
      circle_id: selected.id,
      member_id: handForm.member_id,
      hand_no: Number(handForm.hand_no),
      role: handForm.role,
    });
    if (error) return setError(error.message);
    setHandForm({ member_id: '', hand_no: '', role: 'member' });
    loadCircleDetail(selected.id);
  }

  async function addRound(e) {
    e.preventDefault();
    if (!selected) return;
    setError('');
    const { error } = await supabase.from('rounds').insert({
      circle_id: selected.id,
      round_no: Number(roundForm.round_no),
      due_date: roundForm.due_date || null,
      status: roundForm.status,
    });
    if (error) return setError(error.message);
    setRoundForm({ round_no: '', due_date: '', status: 'pending' });
    loadCircleDetail(selected.id);
  }

  async function removeCircle(id) {
    await supabase.from('circles').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    loadCircles();
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <form onSubmit={addCircle} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>ตั้งวงใหม่</div>
          <Field label="ชื่อวง">
            <input style={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="ค่างวด/มือ (บาท)">
              <input style={field} inputMode="numeric" value={form.hand_amount} onChange={(e) => setForm({ ...form, hand_amount: e.target.value })} required />
            </Field>
            <Field label="จำนวนมือ">
              <input style={field} inputMode="numeric" value={form.hands_count} onChange={(e) => setForm({ ...form, hands_count: e.target.value })} required />
            </Field>
          </div>
          <Field label="รูปแบบดอก">
            <select style={field} value={form.bid_type} onChange={(e) => setForm({ ...form, bid_type: e.target.value })}>
              {BID_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ความถี่ในการเก็บเงิน/เปีย">
            <select style={field} value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="ค่าดูแลท้าว (%)">
              <input style={field} inputMode="numeric" value={form.fee_percent} onChange={(e) => setForm({ ...form, fee_percent: e.target.value })} />
            </Field>
            {form.frequency === 'รายเดือน' && (
              <Field label="วันเปียของเดือน">
                <input style={field} inputMode="numeric" value={form.payout_day} onChange={(e) => setForm({ ...form, payout_day: e.target.value })} />
              </Field>
            )}
            {form.frequency === 'รายสัปดาห์' && (
              <Field label="วันเปียในสัปดาห์">
                <select style={field} value={form.payout_weekday} onChange={(e) => setForm({ ...form, payout_weekday: e.target.value })}>
                  {WEEKDAYS.map((w, i) => (
                    <option key={w} value={i}>
                      {w}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
          <Field label="วันเริ่มวง">
            <input style={field} type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          </Field>
          <Field label="ท้าวแชร์">
            <select style={field} value={form.owner_member_id} onChange={(e) => setForm({ ...form, owner_member_id: e.target.value })}>
              <option value="">— เลือกสมาชิก —</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          {error && <div style={{ fontSize: 12, color: 'hsl(var(--destructive))' }}>{error}</div>}
          <Button type="submit" variant="primary" size="sm">
            สร้างวง
          </Button>
        </form>

        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>วงทั้งหมด · {circles.length}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {circles.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  cursor: 'pointer',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  background: selected?.id === c.id ? 'hsl(var(--secondary))' : 'transparent',
                  border: '1px solid ' + (selected?.id === c.id ? 'hsl(var(--gold)/0.4)' : 'transparent'),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                    ฿{Number(c.hand_amount).toLocaleString()} × {c.hands_count} มือ · {c.owner?.name || 'ไม่มีท้าว'}
                  </div>
                  <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>{scheduleLabel(c)}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCircle(c.id);
                  }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: 'hsl(var(--destructive))' }}
                >
                  ลบ
                </button>
              </div>
            ))}
            {circles.length === 0 && <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>ยังไม่มีวง</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!selected ? (
          <div style={{ ...card, fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>เลือกวงทางซ้ายเพื่อจัดการสมาชิกและงวด</div>
        ) : (
          <>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 2 }}>
                ฿{Number(selected.hand_amount).toLocaleString()} × {selected.hands_count} มือ · {selected.bid_type} · ค่าดูแล {selected.fee_percent}% · {scheduleLabel(selected)}
              </div>
            </div>

            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>สมาชิกในวง · {circleMembers.length}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                <thead>
                  <tr>
                    <th style={th}>มือ</th>
                    <th style={th}>ชื่อ</th>
                    <th style={th}>บทบาท</th>
                  </tr>
                </thead>
                <tbody>
                  {circleMembers.map((cm) => (
                    <tr key={cm.id}>
                      <td style={td}>{cm.hand_no}</td>
                      <td style={td}>{cm.member?.name}</td>
                      <td style={td}>{cm.role === 'owner' ? 'ท้าวแชร์' : 'ลูกแชร์'}</td>
                    </tr>
                  ))}
                  {circleMembers.length === 0 && (
                    <tr>
                      <td style={td} colSpan={3}>
                        ยังไม่มีสมาชิกในวงนี้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <form onSubmit={addHand} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ minWidth: 160 }}>
                  <Field label="สมาชิก">
                    <select style={field} value={handForm.member_id} onChange={(e) => setHandForm({ ...handForm, member_id: e.target.value })} required>
                      <option value="">— เลือก —</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div style={{ width: 80 }}>
                  <Field label="มือที่">
                    <input style={field} inputMode="numeric" value={handForm.hand_no} onChange={(e) => setHandForm({ ...handForm, hand_no: e.target.value })} required />
                  </Field>
                </div>
                <div style={{ width: 120 }}>
                  <Field label="บทบาท">
                    <select style={field} value={handForm.role} onChange={(e) => setHandForm({ ...handForm, role: e.target.value })}>
                      <option value="member">ลูกแชร์</option>
                      <option value="owner">ท้าวแชร์</option>
                    </select>
                  </Field>
                </div>
                <Button type="submit" variant="outline" size="sm">
                  เพิ่มมือ
                </Button>
              </form>
            </div>

            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>งวด · {rounds.length}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                <thead>
                  <tr>
                    <th style={th}>งวดที่</th>
                    <th style={th}>ครบกำหนด</th>
                    <th style={th}>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((r) => (
                    <tr key={r.id}>
                      <td style={td}>{r.round_no}</td>
                      <td style={td}>{r.due_date || '—'}</td>
                      <td style={td}>{r.status}</td>
                    </tr>
                  ))}
                  {rounds.length === 0 && (
                    <tr>
                      <td style={td} colSpan={3}>
                        ยังไม่มีงวด
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <form onSubmit={addRound} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ width: 90 }}>
                  <Field label="งวดที่">
                    <input style={field} inputMode="numeric" value={roundForm.round_no} onChange={(e) => setRoundForm({ ...roundForm, round_no: e.target.value })} required />
                  </Field>
                </div>
                <div style={{ width: 160 }}>
                  <Field label="ครบกำหนด">
                    <input style={field} type="date" value={roundForm.due_date} onChange={(e) => setRoundForm({ ...roundForm, due_date: e.target.value })} />
                  </Field>
                </div>
                <div style={{ width: 140 }}>
                  <Field label="สถานะ">
                    <select style={field} value={roundForm.status} onChange={(e) => setRoundForm({ ...roundForm, status: e.target.value })}>
                      <option value="pending">รอเปิด</option>
                      <option value="open">เปิดรับซอง</option>
                      <option value="closed">ปิดรับซอง</option>
                      <option value="winner_declared">ประกาศผลแล้ว</option>
                      <option value="paid">จ่ายแล้ว</option>
                    </select>
                  </Field>
                </div>
                <Button type="submit" variant="outline" size="sm">
                  เพิ่มงวด
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

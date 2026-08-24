import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { card, th, td } from './adminStyles.js';

const stat = {
  ...card,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const statLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'hsl(var(--muted-foreground))',
};

const statValue = {
  fontFamily: 'var(--font-display)',
  fontSize: 30,
  fontWeight: 700,
};

export function DashboardTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ circles: 0, members: 0, collected: 0, pendingSlips: 0 });
  const [recentSlips, setRecentSlips] = useState([]);
  const [openRounds, setOpenRounds] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [circlesRes, membersRes, approvedRes, pendingRes, recentSlipsRes, openRoundsRes] = await Promise.all([
        supabase.from('circles').select('id', { count: 'exact', head: true }),
        supabase.from('members').select('id', { count: 'exact', head: true }),
        supabase.from('slips').select('amount').eq('status', 'อนุมัติแล้ว'),
        supabase.from('slips').select('id', { count: 'exact', head: true }).eq('status', 'รอตรวจ'),
        supabase
          .from('slips')
          .select('*, circle:circle_id(name), circle_member:circle_member_id(member:member_id(name))')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('rounds').select('*, circle:circle_id(name)').eq('status', 'open').order('due_date'),
      ]);

      const collected = (approvedRes.data || []).reduce((sum, s) => sum + Number(s.amount), 0);

      setStats({
        circles: circlesRes.count || 0,
        members: membersRes.count || 0,
        collected,
        pendingSlips: pendingRes.count || 0,
      });
      setRecentSlips(recentSlipsRes.data || []);
      setOpenRounds(openRoundsRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
        <div style={stat}>
          <div style={statLabel}>วงแชร์ทั้งหมด</div>
          <div style={statValue}>{loading ? '—' : stats.circles}</div>
        </div>
        <div style={stat}>
          <div style={statLabel}>สมาชิกทั้งหมด</div>
          <div style={statValue}>{loading ? '—' : stats.members}</div>
        </div>
        <div style={stat}>
          <div style={statLabel}>ยอดเก็บแล้ว (อนุมัติ)</div>
          <div style={{ ...statValue, color: 'hsl(var(--gold))' }}>{loading ? '—' : `฿${stats.collected.toLocaleString()}`}</div>
        </div>
        <div style={stat}>
          <div style={statLabel}>สลิปรอตรวจ</div>
          <div style={{ ...statValue, color: stats.pendingSlips > 0 ? 'hsl(var(--destructive))' : undefined }}>{loading ? '—' : stats.pendingSlips}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, alignItems: 'start' }}>
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>งวดที่กำลังเปิดรับซอง</div>
          {openRounds.length === 0 ? (
            <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>ไม่มีงวดที่เปิดอยู่ตอนนี้</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>วง</th>
                  <th style={th}>งวดที่</th>
                  <th style={th}>ครบกำหนด</th>
                </tr>
              </thead>
              <tbody>
                {openRounds.map((r) => (
                  <tr key={r.id}>
                    <td style={td}>{r.circle?.name}</td>
                    <td style={td}>{r.round_no}</td>
                    <td style={td}>{r.due_date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>สลิปล่าสุด</div>
          {recentSlips.length === 0 ? (
            <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>ยังไม่มีสลิป</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>สมาชิก</th>
                  <th style={th}>วง</th>
                  <th style={th}>จำนวนเงิน</th>
                  <th style={th}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {recentSlips.map((s) => (
                  <tr key={s.id}>
                    <td style={td}>{s.circle_member?.member?.name}</td>
                    <td style={td}>{s.circle?.name}</td>
                    <td style={td}>฿{Number(s.amount).toLocaleString()}</td>
                    <td
                      style={{
                        ...td,
                        fontWeight: 600,
                        color: s.status === 'อนุมัติแล้ว' ? 'hsl(var(--sage))' : s.status === 'ตีกลับ' ? 'hsl(var(--destructive))' : 'hsl(var(--gold))',
                      }}
                    >
                      {s.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

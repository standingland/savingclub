import { supabase } from './supabase.js';

// '' / null / undefined = ยังไม่ระบุมือ → เก็บเป็น null ในฐานข้อมูล
export function toHandNo(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? n : null;
}

export async function fetchMyCircles(memberId) {
  const { data, error } = await supabase
    .from('circle_members')
    .select(
      'id, hand_no, role, circle:circle_id(id, name, hand_amount, hands_count, bid_type, frequency, payout_day, status, invite_code, owner_member_id)',
    )
    .eq('member_id', memberId)
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function fetchMyCircleMemberIds(memberId) {
  const { data, error } = await supabase.from('circle_members').select('id').eq('member_id', memberId);
  if (error) throw error;
  return (data ?? []).map((row) => row.id);
}

// Earliest not-yet-paid installment across every circle this member belongs to.
export async function fetchNextDue(memberId) {
  const circleMemberIds = await fetchMyCircleMemberIds(memberId);
  if (!circleMemberIds.length) return null;

  const { data, error } = await supabase
    .from('installments')
    .select(
      'id, amount_due, status, round_id, circle_member_id, round:round_id(round_no, due_date, status, circle:circle_id(id, name))',
    )
    .in('circle_member_id', circleMemberIds)
    .neq('status', 'paid');
  if (error) throw error;

  const withDueDate = (data ?? []).filter((row) => row.round?.due_date);
  withDueDate.sort((a, b) => a.round.due_date.localeCompare(b.round.due_date));
  return withDueDate[0] ?? null;
}

export async function fetchCircleDetail(circleId) {
  const [handsRes, roundsRes] = await Promise.all([
    // มือที่ยังไม่ระบุ (hand_no = null) ต่อท้ายรายการ
    supabase
      .from('circle_members')
      .select('id, hand_no, role, member_id, member:member_id(name)')
      .eq('circle_id', circleId)
      .order('hand_no', { nullsFirst: false }),
    supabase
      .from('rounds')
      .select('id, round_no, due_date, status, winning_bid, winner:winner_circle_member_id(hand_no, member:member_id(name))')
      .eq('circle_id', circleId)
      .order('round_no'),
  ]);
  if (handsRes.error) throw handsRes.error;
  if (roundsRes.error) throw roundsRes.error;
  return { hands: handsRes.data ?? [], rounds: roundsRes.data ?? [] };
}

export async function createCircleWithOwner(form, ownerMemberId) {
  const handsCount = Number(form.hands) || 1;
  // ท้าวแชร์เว้นมือของตัวเองไว้ได้ ถ้ายังไม่รู้ว่าจะรับมือที่เท่าไหร่ — แต่ถ้าระบุต้องอยู่ในช่วงของวง
  const ownerHand = toHandNo(form.ownerHand);
  if (ownerHand !== null && ownerHand > handsCount) throw new Error('invalid_hand_no');

  const { data: circle, error } = await supabase
    .from('circles')
    .insert({
      name: form.name.trim(),
      hand_amount: Number(form.hand) || 0,
      hands_count: handsCount,
      bid_type: form.type,
      fee_percent: Number(form.fee) || 0,
      frequency: form.frequency,
      payout_day: form.frequency === 'รายเดือน' ? Number(form.payoutDay) || 25 : null,
      payout_weekday: form.frequency === 'รายสัปดาห์' ? Number(form.weekday) : null,
      owner_member_id: ownerMemberId,
    })
    .select()
    .single();
  if (error) throw error;

  const { error: handError } = await supabase.from('circle_members').insert({
    circle_id: circle.id,
    member_id: ownerMemberId,
    hand_no: ownerHand,
    role: 'owner',
  });
  if (handError) throw handError;

  return circle;
}

export async function fetchOwnerSlips(ownerMemberId) {
  const { data, error } = await supabase
    .from('slips')
    .select(
      'id, amount, status, transferred_at, circle:circle_id!inner(id, name, owner_member_id), circle_member:circle_member_id(hand_no, member:member_id(name)), round:round_id(round_no)',
    )
    .eq('circle.owner_member_id', ownerMemberId)
    .order('transferred_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setSlipStatus(id, status) {
  const { error } = await supabase.from('slips').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function previewCircleByInviteCode(code) {
  const { data, error } = await supabase.rpc('preview_circle_by_invite_code', { p_code: code });
  if (error) throw error;
  return data?.[0] ?? null;
}

// handNo = null → เข้าร่วมวงโดยยังไม่ระบุมือ ค่อยมาเลือกทีหลัง
export async function joinCircleByInviteCode(code, handNo) {
  const { data, error } = await supabase.rpc('join_circle_by_invite_code', { p_code: code, p_hand_no: toHandNo(handNo) });
  if (error) throw error;
  return data;
}

// สมาชิกระบุ (หรือล้าง) มือของตัวเองในวงที่เข้าร่วมอยู่แล้ว
export async function setMyHandNo(circleId, handNo) {
  const { data, error } = await supabase.rpc('set_my_hand_no', { p_circle_id: circleId, p_hand_no: toHandNo(handNo) });
  if (error) throw error;
  return data;
}

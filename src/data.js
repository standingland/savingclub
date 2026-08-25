// [elapsedFraction, bidderName, amount] — scripted auto-bidders during the live auction demo
export const BID_SCRIPT = [
  [0.2, 'นภา ทองดี', 180],
  [0.34, 'วิชัย พูนผล', 220],
  [0.47, 'มานี ศรีสุข', 250],
  [0.6, 'วิชัย พูนผล', 280],
  [0.74, 'ดวงพร แก้วใส', 310],
  [0.86, 'มานี ศรีสุข', 350],
];

export const fmt = (n) => '฿' + Number(n).toLocaleString('en-US');

// hand_no เว้นว่างได้ — ตอนเข้าร่วมวงบางคนยังไม่รู้ว่าจะรับมือที่เท่าไหร่ แล้วค่อยมาระบุทีหลัง
export const UNASSIGNED_HAND_LABEL = 'ยังไม่ระบุมือ';

export const handLabel = (handNo) => (handNo == null ? UNASSIGNED_HAND_LABEL : 'มือที่ ' + handNo);

export const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

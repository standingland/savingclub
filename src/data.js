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

export const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

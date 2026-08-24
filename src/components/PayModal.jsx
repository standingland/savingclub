import { Button } from './ui/Button.jsx';

export function PayModal({ open, due, slipSent, onClose, onAttachSlip }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'hsl(221 39% 11%/0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: 24,
          width: 400,
          maxWidth: '100%',
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          boxShadow: 'var(--shadow-elevated)',
          animation: 'wj-in .3s var(--ease-brand)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'hsl(var(--muted-foreground))',
          }}
        >
          ชำระค่างวด · แนบหลักฐาน
        </div>

        {!due ? (
          <>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 17, marginTop: 10 }}>ยังไม่มีรายการที่ต้องชำระ</div>
            <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 6, lineHeight: 1.6 }}>
              เมื่อคุณเข้าร่วมวงแชร์และถึงกำหนดค่างวด รายการที่ต้องชำระจะแสดงที่นี่
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" pill onClick={onClose}>
                ปิดหน้าต่าง
              </Button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 19, marginTop: 6 }}>
              {due.circle} · {due.roundLabel}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{due.amount}</span>
              <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>ครบกำหนด {due.dueDate}</span>
            </div>

            {slipSent ? (
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 'var(--radius)',
                  background: 'hsl(var(--sage)/0.12)',
                  border: '1px solid hsl(var(--sage)/0.4)',
                  fontSize: 13,
                  color: 'hsl(150 28% 34%)',
                  fontWeight: 600,
                }}
              >
                ✓ ส่งสลิปเรียบร้อย — สถานะ &ldquo;รอท้าวแชร์ตรวจสอบ&rdquo; จะอัปเดตอัตโนมัติ
              </div>
            ) : (
              <button
                onClick={onAttachSlip}
                style={{
                  marginTop: 16,
                  width: '100%',
                  border: '1.5px dashed hsl(var(--border))',
                  background: 'hsl(var(--secondary)/0.5)',
                  borderRadius: 'var(--radius)',
                  padding: 22,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'hsl(var(--muted-foreground))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'hsl(var(--gold))';
                  e.currentTarget.style.background = 'hsl(var(--gold-soft))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'hsl(var(--border))';
                  e.currentTarget.style.background = 'hsl(var(--secondary)/0.5)';
                }}
              >
                <div style={{ fontSize: 22, lineHeight: 1 }}>⇪</div>
                <div style={{ marginTop: 6, fontWeight: 600, color: 'hsl(var(--foreground))' }}>แตะเพื่อแนบสลิปโอนเงิน</div>
                <div style={{ marginTop: 2, fontSize: 11.5 }}>รองรับ JPG / PNG · ระบบอ่านยอดและเวลาโอนอัตโนมัติ</div>
              </button>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" pill onClick={onClose}>
                ปิดหน้าต่าง
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

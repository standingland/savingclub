export function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 80,
        background: 'hsl(var(--foreground))',
        color: '#fff',
        padding: '12px 22px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontSize: 13.5,
        fontWeight: 600,
        boxShadow: 'var(--shadow-elevated)',
        animation: 'wj-in .3s var(--ease-brand)',
      }}
    >
      {message}
    </div>
  );
}

export function BrandMark({ size = 44, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        background: 'hsl(var(--foreground))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 0 1px hsl(var(--gold)/0.5), 0 ${size * 0.14}px ${size * 0.34}px hsl(24 30% 25% / 0.18)`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: Math.max(3, size * 0.07),
          borderRadius: '50%',
          border: '1px solid hsl(var(--gold)/0.55)',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: size * 0.45,
          lineHeight: 1,
          color: 'hsl(var(--gold))',
        }}
      >
        S
      </span>
    </div>
  );
}

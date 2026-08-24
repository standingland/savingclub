const VARIANTS = {
  neutral: {
    background: 'hsl(var(--secondary))',
    color: 'hsl(var(--muted-foreground))',
    border: '1px solid transparent',
  },
  gold: {
    background: 'hsl(var(--gold) / 0.1)',
    color: 'hsl(var(--gold))',
    border: '1px solid hsl(var(--gold) / 0.4)',
  },
  solid: {
    background: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
    border: '1px solid hsl(var(--primary))',
  },
  outline: {
    background: 'transparent',
    color: 'hsl(var(--foreground))',
    border: '1px solid hsl(var(--border))',
  },
  line: {
    background: 'hsl(var(--line-green) / 0.12)',
    color: 'hsl(var(--line-green))',
    border: '1px solid hsl(var(--line-green) / 0.35)',
  },
};

export function Badge({ children, variant = 'neutral', icon: Icon, className = '', style = {}, ...props }) {
  const v = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1,
        borderRadius: 'var(--radius-pill)',
        ...v,
        ...style,
      }}
      {...props}
    >
      {Icon ? <Icon size={12} strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

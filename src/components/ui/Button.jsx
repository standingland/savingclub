const SIZES = {
  sm: { height: 34, padding: '0 14px', fontSize: 13, gap: 6, icon: 15 },
  md: { height: 42, padding: '0 22px', fontSize: 14, gap: 8, icon: 17 },
  lg: { height: 52, padding: '0 30px', fontSize: 16, gap: 9, icon: 19 },
};

const VARIANTS = {
  primary: {
    background: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
    border: '1px solid hsl(var(--primary))',
    boxShadow: 'var(--shadow-soft)',
  },
  pride: {
    background: 'var(--gradient-pride)',
    color: 'hsl(var(--foreground))',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: 'var(--shadow-elevated)',
  },
  gold: {
    background: 'hsl(var(--gold))',
    color: '#fff',
    border: '1px solid hsl(var(--gold))',
    boxShadow: 'var(--shadow-gold)',
  },
  line: {
    background: 'hsl(var(--line-green))',
    color: '#fff',
    border: '1px solid hsl(var(--line-green))',
    boxShadow: 'var(--shadow-elevated)',
  },
  outline: {
    background: 'hsl(var(--card) / 0.72)',
    color: 'hsl(var(--foreground))',
    border: '1px solid hsl(var(--border))',
    boxShadow: 'var(--shadow-soft)',
    backdropFilter: 'blur(8px)',
  },
  ghost: {
    background: 'transparent',
    color: 'hsl(var(--foreground))',
    border: '1px solid transparent',
    boxShadow: 'none',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  icon: Icon,
  iconRight: IconRight,
  block = false,
  disabled = false,
  className = '',
  style = {},
  ...props
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      disabled={disabled}
      className={className}
      style={{
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-body)',
        fontSize: s.fontSize,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius)',
        transition:
          'transform var(--dur-fast) var(--ease-brand), box-shadow var(--dur-fast) var(--ease-brand), background var(--dur-fast)',
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-1.5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      {...props}
    >
      {Icon ? <Icon size={s.icon} strokeWidth={1.85} /> : null}
      {children}
      {IconRight ? <IconRight size={s.icon} strokeWidth={1.85} /> : null}
    </button>
  );
}

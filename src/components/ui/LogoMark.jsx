export function LogoMark({
  size = 44,
  wordmark = false,
  tagline,
  aura = false,
  mono = false,
  className = '',
  style = {},
}) {
  const radius = Math.max(8, size * 0.32);
  const mark = (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {aura ? (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.18,
            borderRadius: '50%',
            background: 'var(--gradient-pride)',
            filter: `blur(${size * 0.22}px)`,
            opacity: 0.55,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: radius,
          background: mono ? 'hsl(var(--primary))' : 'var(--gradient-pride-vivid)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.28)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: size * 0.62,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            color: '#fff',
          }}
        >
          M
        </span>
      </div>
    </div>
  );

  if (!wordmark) {
    return (
      <div className={className} style={style}>
        {mark}
      </div>
    );
  }

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: size * 0.3, ...style }}>
      {mark}
      <div style={{ lineHeight: 1.1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: size * 0.42,
            letterSpacing: '-0.025em',
            color: 'hsl(var(--foreground))',
          }}
        >
          M Private Project
        </div>
        {tagline ? (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: Math.max(9, size * 0.2),
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'hsl(var(--muted-foreground))',
              marginTop: size * 0.12,
            }}
          >
            {tagline}
          </div>
        ) : null}
      </div>
    </div>
  );
}

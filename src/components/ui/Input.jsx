import { useState } from 'react';

export function Input({ label, icon: Icon, hint, error, className = '', style = {}, id, ...props }) {
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [focused, setFocused] = useState(false);
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 7, ...style }}>
      {label ? (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            color: 'hsl(var(--foreground))',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </label>
      ) : null}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          height: 44,
          padding: '0 14px',
          borderRadius: 'var(--radius)',
          background: 'hsl(var(--card))',
          border: `1px solid ${error ? 'hsl(var(--destructive))' : focused ? 'hsl(var(--gold))' : 'hsl(var(--input))'}`,
          boxShadow: focused ? '0 0 0 3px hsl(var(--gold) / 0.18)' : 'none',
          transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
        }}
      >
        {Icon ? <Icon size={17} strokeWidth={1.8} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} /> : null}
        <input
          id={inputId}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'hsl(var(--foreground))',
          }}
          {...props}
        />
      </div>
      {error ? (
        <span style={{ fontSize: 12, color: 'hsl(var(--destructive))' }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{hint}</span>
      ) : null}
    </div>
  );
}

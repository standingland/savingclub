import { label as labelStyle } from './adminStyles.js';

export function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

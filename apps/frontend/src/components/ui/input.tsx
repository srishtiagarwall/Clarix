import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, fullWidth = true, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      width: fullWidth ? '100%' : 'auto',
      marginBottom: '1rem',
    };

    const labelStyle: React.CSSProperties = {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: error ? '#ef4444' : (isFocused ? 'var(--accent-primary)' : 'var(--text-secondary)'),
      transition: 'color var(--transition-fast)',
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-secondary)',
      border: `1px solid ${error ? '#ef4444' : (isFocused ? 'var(--accent-primary)' : 'var(--border-strong)')}`,
      color: 'var(--text-primary)',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all var(--transition-fast)',
      fontFamily: 'inherit',
      boxShadow: isFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
      ...style,
    };

    return (
      <div style={containerStyle} className={className}>
        {label && <label style={labelStyle}>{label}</label>}
        <input
          ref={ref}
          style={inputStyle}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

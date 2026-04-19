import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      fontWeight: 500,
      transition: 'all var(--transition-fast)',
      fontFamily: 'var(--font-inter, inherit)',
      position: 'relative',
      overflow: 'hidden',
    };

    const variants: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--accent-primary)',
        color: '#ffffff',
        boxShadow: 'var(--shadow-md)',
      },
      secondary: {
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-strong)',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--accent-primary)',
        border: '1px solid var(--accent-primary)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
      }
    };

    const hoverVariants: Record<string, React.CSSProperties> = {
      primary: { backgroundColor: 'var(--accent-hover)', transform: 'translateY(-1px)', boxShadow: 'var(--shadow-glow)' },
      secondary: { backgroundColor: 'var(--bg-surface-hover)' },
      outline: { backgroundColor: 'var(--accent-glow)' },
      ghost: { backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' },
    };

    const sizes: Record<string, React.CSSProperties> = {
      sm: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
      md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
      lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    };

    const [isHovered, setIsHovered] = React.useState(false);

    const mergedStyle = {
      ...baseStyle,
      ...variants[variant],
      ...sizes[size],
      ...(isHovered ? hoverVariants[variant] : {}),
      ...(props.disabled || isLoading ? { opacity: 0.6, cursor: 'not-allowed', transform: 'none' } : {}),
      ...props.style,
    };

    return (
      <button
        ref={ref}
        style={mergedStyle}
        onMouseEnter={(e) => {
          setIsHovered(true);
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          props.onMouseLeave?.(e);
        }}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span style={{ marginRight: '0.5rem', animation: 'pulse-slow 1.5s infinite' }}>
            ●
          </span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

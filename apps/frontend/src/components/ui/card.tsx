import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverLift = false, glow = false, children, style, ...props }, ref) => {
    
    const [isHovered, setIsHovered] = React.useState(false);

    const baseStyle: React.CSSProperties = {
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all var(--transition-normal)',
      position: 'relative',
      overflow: 'hidden',
    };

    const hoverStyle: React.CSSProperties = {
      ...(hoverLift ? { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-lg)' } : {}),
      ...(glow ? { borderColor: 'var(--border-strong)' } : {}),
    };

    const mergedStyle = {
      ...baseStyle,
      ...(isHovered ? hoverStyle : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        style={mergedStyle}
        className={`glass ${className}`}
        onMouseEnter={(e) => {
          setIsHovered(true);
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          props.onMouseLeave?.(e);
        }}
        {...props}
      >
        {glow && isHovered && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--accent-glow), transparent 40%)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.5,
            transition: 'opacity var(--transition-normal)'
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={fullWidth ? { width: '100%' } : {}}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

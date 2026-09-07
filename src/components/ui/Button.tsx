import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled,
  type = 'button',
  children,
  ...props
}) => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'ui-button-primary',
    secondary: 'ui-button-secondary',
    ghost: 'ui-button-ghost',
    danger: 'ui-button-danger',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`ui-button ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

/**
 * Botao reutilizavel com suporte a estado de carregamento e variantes visuais.
 */
export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant}${className ? ` ${className}` : ''}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}

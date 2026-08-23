import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Campo de formulario reutilizavel com label, mensagem de erro e
 * estilizacao consistente em toda a aplicacao.
 */
export function FormInput({ label, error, id, ...inputProps }: FormInputProps){
  const inputId = id || inputProps.name;

  return (
    <div className="form-field">
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      <input
        id={inputId}
        className={`form-input${error ? ' form-input--error' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...inputProps}
      />
      {error && (
        <span id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

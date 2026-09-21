import './css/alert.css';

interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
}

/**
 * Componente de alerta usado para exibir mensagens de erro, sucesso ou
 * informacao em um balão flutuante padronizado.
 */
export function Alert({ type = 'info', message }: AlertProps) {
  return (
    <div
      className={`alert alert--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="alert__icon" aria-hidden="true">
        {type === 'error' ? '!' : type === 'success' ? '✓' : 'i'}
      </span>
      <span className="alert__text">{message}</span>
    </div>
  );
}

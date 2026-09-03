interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
}

/**
 * Componente de alerta usado para exibir mensagens de erro, sucesso ou
 * informacao de forma visualmente consistente.
 */
export function Alert({ type = 'info', message }: AlertProps) {
  return (
    <div className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}

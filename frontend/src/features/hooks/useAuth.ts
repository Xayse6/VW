import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

/**
 * Hook de conveniencia para acessar o contexto de autenticacao.
 * Lanca um erro claro caso seja usado fora do AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
}


import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

/**
 * Protege rotas que exigem autenticacao. Enquanto a sessao esta sendo
 * restaurada, exibe um estado de carregamento; caso o usuario nao esteja
 * autenticado, redireciona para a tela de login.
 */
export function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles?: Array<'client' | 'adm' | 'emp'>;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loading">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="page-access-denied">
        <h1>Acesso negado</h1>
        <p>Você não possui permissão para acessar esta área.</p>
        <Navigate to="/profile" replace />
      </div>
    );
  }

  return <Outlet />;
}

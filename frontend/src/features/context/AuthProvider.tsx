import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authService } from '../../features/auth/service/authService';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../../services/api';

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '../../types';

import { AuthContext } from './AuthContext';

/**
 * Provider responsável por manter o estado de autenticação da aplicação,
 * incluindo o usuário logado e as operações de login, cadastro e logout.
 * Ao carregar, tenta restaurar a sessão a partir do token salvo localmente.
 */
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));

  const loadCurrentUser = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      clearStoredToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    setStoredToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authService.register(payload);
    setStoredToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser: loadCurrentUser,
      setUser,
    }),
    [user, isLoading, login, register, logout, loadCurrentUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
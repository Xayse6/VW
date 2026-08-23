import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authService } from '../features/auth/service/authService';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../services/api';

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '../types';

import { AuthContext } from './AuthContext';

/**
 * Provider responsavel por manter o estado de autenticacao da aplicacao,
 * incluindo o usuario logado e as operacoes de login, cadastro e logout.
 * Ao carregar, tenta restaurar a sessao a partir do token salvo localmente.
 */
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
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
  const loadCurrentUser = async () => {
    const token = getStoredToken();

    if (!token) {
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
  };

  void loadCurrentUser();
}, []);

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
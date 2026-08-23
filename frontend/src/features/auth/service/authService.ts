import { api } from '../../../services/api';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '../../../types';

export const authService = {
  async register(
    payload: RegisterPayload
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      '/auth/register',
      payload
    );

    return data;
  },

  async login(
    payload: LoginPayload
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      '/auth/login',
      payload
    );

    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<{ user: User }>(
      '/auth/me'
    );

    return data.user;
  },
};
import { api } from './api';
import type { UpdateUserPayload, User } from '../types';

/**
 * Camada de servico responsavel pelas chamadas de gerenciamento de usuarios.
 */
export const userService = {
  async getById(id: string): Promise<User> {
    const { data } = await api.get<{ user: User }>(`/users/${id}`);
    return data.user;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put<{ user: User }>(`/users/${id}`, payload);
    return data.user;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

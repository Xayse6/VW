import { api } from '../../../services/api';

export interface Modelo {
  id_modelo: string;
  id_marca: string;
  nome_marca: string;
  nome_modelo: string;
  ano_modelo: number;
}

export interface ModeloPayload {
  id_marca: string;
  nome_modelo: string;
  ano_modelo: number;
}

export const modeloService = {
  async getAll(): Promise<Modelo[]> {
    const { data } = await api.get<{ modelos: Modelo[] }>('/modelos');
    return data.modelos;
  },

  async getById(id: string): Promise<Modelo> {
    const { data } = await api.get<{ modelo: Modelo }>(`/modelos/${id}`);
    return data.modelo;
  },

  async create(payload: ModeloPayload): Promise<Modelo> {
    const { data } = await api.post<{ modelo: Modelo }>('/modelos', payload);
    return data.modelo;
  },

  async update(id: string, payload: ModeloPayload): Promise<Modelo> {
    const { data } = await api.put<{ modelo: Modelo }>(`/modelos/${id}`, payload);
    return data.modelo;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/modelos/${id}`);
  },
};

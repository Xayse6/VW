import { api } from '../../../services/api';

export interface Marca {
  id_marca: string;
  nome_marca: string;
}

export interface MarcaPayload {
  nome_marca: string;
}

export const marcaService = {
  async getAll(): Promise<Marca[]> {
    const { data } = await api.get<{ marcas: Marca[] }>('/marcas');
    return data.marcas;
  },

  async getById(id: string): Promise<Marca> {
    const { data } = await api.get<{ marca: Marca }>(`/marcas/${id}`);
    return data.marca;
  },

  async create(payload: MarcaPayload): Promise<Marca> {
    const { data } = await api.post<{ marca: Marca }>('/marcas', payload);
    return data.marca;
  },

  async update(id: string, payload: MarcaPayload): Promise<Marca> {
    const { data } = await api.put<{ marca: Marca }>(`/marcas/${id}`, payload);
    return data.marca;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/marcas/${id}`);
  },
};

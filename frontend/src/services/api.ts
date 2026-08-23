import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import type { ApiErrorResponse } from '../types';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

/**
 * Instancia centralizada do Axios. Toda a comunicacao HTTP com o backend
 * passa por aqui, o que facilita adicionar interceptors, headers padrao
 * e tratamento de erros de forma consistente.
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_STORAGE_KEY = 'um_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

// Anexa o token JWT (se existir) em todas as requisicoes automaticamente
api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Extrai uma mensagem de erro amigavel a partir de um erro do Axios,
 * cobrindo falhas de validacao, erros da API e falhas de rede.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (!axiosError.response) {
      return 'Nao foi possivel se conectar ao servidor. Verifique sua conexao e tente novamente.';
    }

    const data = axiosError.response.data;

    if (data?.details && data.details.length > 0) {
      return data.details.map((detail) => detail.message).join(' ');
    }

    if (data?.error) {
      return data.error;
    }

    return 'Ocorreu um erro inesperado. Tente novamente.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}
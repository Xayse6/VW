import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';

import { APP_ERROR_MESSAGES } from '../messages/errors';
import type { ApiErrorResponse } from '../types';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_STORAGE_KEY = 'um_auth_token';

export function shouldAttemptTokenRefresh(
  url: string | undefined,
  status: number | undefined
): boolean {
  return Boolean(
    status === 401 &&
    url &&
    !url.startsWith('/auth/') &&
    getStoredToken()
  );
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { __isRetry?: boolean };

    if (
      shouldAttemptTokenRefresh(originalRequest?.url, error.response?.status) &&
      !originalRequest.__isRetry
    ) {
      originalRequest.__isRetry = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const nextToken = data?.token;

        if (nextToken) {
          setStoredToken(nextToken);
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
          return api(originalRequest);
        }

        clearStoredToken();
        window.location.href = '/login';
        return Promise.reject(error);
      } catch {
        clearStoredToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (!axiosError.response) {
      return APP_ERROR_MESSAGES.SERVER_UNAVAILABLE;
    }

    const data = axiosError.response.data;

    if (data?.details && data.details.length > 0) {
      return data.details.map((detail) => detail.message).join(' ');
    }

    if (data?.error) {
      return data.error;
    }

    if (data?.message) {
      return data.message;
    }

    return APP_ERROR_MESSAGES.UNEXPECTED;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return APP_ERROR_MESSAGES.UNEXPECTED;
}
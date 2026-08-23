export interface User {
  id_usuario: string;
  nome_usuario: string;
  email_usuario: string;
  role: "client" | "adm" | "emp";
  created_at_usuario: string;
  updated_at_usuario: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterPayload {
  nome_usuario: string;
  email_usuario: string;
  password: string;
}

export interface LoginPayload {
  email_usuario: string;
  password: string;
}

export interface UpdateUserPayload {
  nome_usuario?: string;
  email_usuario?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: ApiErrorDetail[];
}
export interface UserRecord {
  id_usuario: string;

  nome_usuario: string;

  email_usuario: string;

  password_hash: string;

  id_role: string;

  nome_role: 'client' | 'adm' | 'emp';

  created_at_usuario: Date;

  updated_at_usuario: Date;
}

export interface PublicUser {
  id_usuario: string;

  nome_usuario: string;

  email_usuario: string;

  role: 'client' | 'adm' | 'emp';

  created_at_usuario: string;

  updated_at_usuario: string;
}

export interface JwtPayload {
  sub: string;

  email: string;

  role: 'client' | 'adm' | 'emp';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';
import type { JwtPayload } from '../types/users';
import { getPermissionsForRole } from './permissions';

function normalizeJwtPayload(payload: Omit<JwtPayload, 'permissions' | 'iat' | 'exp'> & { permissions?: string[] }) {
  return {
    ...payload,
    permissions: payload.permissions ?? getPermissionsForRole(payload.role),
    type: payload.type ?? 'access',
  };
}

/**
 * Assina um token JWT contendo os dados mínimos
 * necessários para identificar o usuário.
 */
export function signToken(
  payload: Omit<JwtPayload, 'permissions' | 'iat' | 'exp' | 'type'> & { permissions?: string[]; type?: 'access' | 'refresh' }
): string {
  const fullPayload = normalizeJwtPayload(payload);
  const options: SignOptions = {
    expiresIn: payload.type === 'refresh'
      ? (env.jwtRefreshExpiresIn as SignOptions['expiresIn'])
      : (env.jwtAccessExpiresIn as SignOptions['expiresIn']),
  };

  return jwt.sign(fullPayload, payload.type === 'refresh' ? env.jwtRefreshSecret : env.jwtSecret, options);
}

export function signAccessToken(payload: Omit<JwtPayload, 'permissions' | 'iat' | 'exp' | 'type'> & { permissions?: string[] }) {
  return signToken({ ...payload, type: 'access' });
}

export function signRefreshToken(payload: Omit<JwtPayload, 'permissions' | 'iat' | 'exp' | 'type'> & { permissions?: string[] }) {
  return signToken({ ...payload, type: 'refresh' });
}

/**
 * Verifica e decodifica um token JWT.
 *
 * Lança erro se o token for inválido ou estiver expirado.
 */
export function verifyToken(
  token: string,
  type: 'access' | 'refresh' = 'access'
): JwtPayload {
  const secret = type === 'refresh' ? env.jwtRefreshSecret : env.jwtSecret;
  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (!decoded.sub || !decoded.email || !decoded.role) {
    throw new Error('Token sem claims essenciais.');
  }

  if (decoded.type && decoded.type !== type) {
    throw new Error('Tipo de token inválido para esta operação.');
  }

  return {
    ...decoded,
    permissions: decoded.permissions ?? getPermissionsForRole(decoded.role),
    type: decoded.type ?? type,
  };
}
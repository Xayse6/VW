import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';
import type { JwtPayload } from '../types';

/**
 * Assina um token JWT contendo os dados mínimos
 * necessários para identificar o usuário.
 */
export function signToken(
  payload: JwtPayload
): string {
  const options: SignOptions = {
    expiresIn:
      env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(
    payload,
    env.jwtSecret,
    options
  );
}

/**
 * Verifica e decodifica um token JWT.
 *
 * Lança erro se o token for inválido ou estiver expirado.
 */
export function verifyToken(
  token: string
): JwtPayload {
  return jwt.verify(
    token,
    env.jwtSecret
  ) as JwtPayload;
}
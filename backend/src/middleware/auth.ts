import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware de autenticacao. Exige um header "Authorization: Bearer <token>"
 * valido para permitir o acesso a rota protegida.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Nao autenticado. Faca login para continuar.', 401);
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError('Sessao invalida ou expirada. Faca login novamente.', 401);
  }
}

/**
 * Garante que o usuario autenticado so possa acessar/alterar os proprios dados.
 */
export function requireOwnership(paramName = 'id') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const targetId = req.params[paramName];
    if (!req.user || req.user.sub !== targetId) {
      throw new AppError('Voce nao tem permissao para acessar este recurso.', 403);
    }
    next();
  };
}

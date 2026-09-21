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
 * Exige que o usuário possua um dos papéis (roles) autorizados.
 */
export function requireRole(allowedRoles: Array<'adm' | 'client' | 'emp'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError('Acesso negado. Você não tem permissão para realizar esta ação.', 403);
    }
    next();
  };
}

/**
 * Garante que o usuario autenticado seja admin ou o proprio dono do recurso.
 */
export function requireOwnershipOrAdmin(paramName = 'id') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const targetId = req.params[paramName];
    if (!req.user) {
      throw new AppError('Nao autenticado.', 401);
    }

    if (req.user.role !== 'adm' && req.user.sub !== targetId) {
      throw new AppError('Voce nao tem permissao para acessar ou alterar este recurso.', 403);
    }

    next();
  };
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

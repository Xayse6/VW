import { NextFunction, Request, Response } from 'express';
import { AUTH_ERRORS } from '../messages/auth';
import { AppError } from '../utils/AppError';
import { getPermissionsForRole } from '../utils/permissions';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware de autenticacao. Exige um header "Authorization: Bearer <token>"
 * valido para permitir o acesso a rota protegida.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(AUTH_ERRORS.NOT_AUTHENTICATED, 401);
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = verifyToken(token);

    req.user = {
      ...payload,
      permissions: payload.permissions ?? getPermissionsForRole(payload.role),
    };

    next();
  } catch {
    throw new AppError(AUTH_ERRORS.INVALID_SESSION, 401);
  }
}

/**
 * Exige que o usuário possua um dos papéis (roles) autorizados.
 */
export function requireRole(allowedRoles: Array<'adm' | 'client' | 'emp'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError(AUTH_ERRORS.ACCESS_DENIED, 403);
    }
    next();
  };
}

/**
 * Exige uma permissão específica para a ação.
 */
export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_AUTHENTICATED, 401);
    }

    const permissions = req.user.permissions ?? getPermissionsForRole(req.user.role);

    if (!permissions.includes(permission)) {
      throw new AppError(AUTH_ERRORS.ACCESS_DENIED, 403);
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
      throw new AppError(AUTH_ERRORS.USER_NOT_AUTHENTICATED, 401);
    }

    if (req.user.role !== 'adm' && req.user.sub !== targetId) {
      throw new AppError(AUTH_ERRORS.OWNERSHIP_DENIED, 403);
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
      throw new AppError(AUTH_ERRORS.OWNERSHIP_REQUIRED, 403);
    }
    next();
  };
}


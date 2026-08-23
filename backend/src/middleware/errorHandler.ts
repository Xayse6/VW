import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import { ZodError } from 'zod';

import { env } from '../config/env';
import { AppError } from '../utils/AppError';

/**
 * Handler global de erros.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Erros de validação do Zod
  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Dados invalidos.',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });

    return;
  }

  // Erros conhecidos da aplicação
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });

    return;
  }

  // Violação de UNIQUE do PostgreSQL
  if (
    err instanceof Error &&
    'code' in err &&
    err.code === '23505'
  ) {
    res.status(409).json({
      error: 'E-mail ja cadastrado.',
    });

    return;
  }

  // Erro inesperado
  console.error('[ERRO NAO TRATADO]', err);

  res.status(500).json({
    error:
      'Erro interno do servidor. Tente novamente mais tarde.',
    ...(env.nodeEnv === 'development' &&
    err instanceof Error
      ? {
          debug: err.message,
        }
      : {}),
  });
}

/**
 * Middleware para rotas não encontradas.
 */
export function notFoundHandler(
  req: Request,
  res: Response
): void {
  res.status(404).json({
    error: `Rota nao encontrada: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Wrapper para handlers assíncronos.
 */
export function asyncHandler<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req, res, next): void => {
    void fn(req, res, next).catch(next);
  };
}
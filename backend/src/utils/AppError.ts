/**
 * Erro de aplicacao com codigo de status HTTP associado.
 *
 * Permite diferenciar erros esperados da aplicacao
 * de erros inesperados.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 400
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(
      this,
      AppError.prototype
    );

    if (Error.captureStackTrace) {
      Error.captureStackTrace(
        this,
        AppError
      );
    }
  }
}
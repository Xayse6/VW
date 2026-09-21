"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.asyncHandler = asyncHandler;
const zod_1 = require("zod");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
function errorHandler(err, _req, res, _next) {
    // Erros de validação do Zod
    if (err instanceof zod_1.ZodError) {
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
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            error: err.message,
        });
        return;
    }
    // Violação de UNIQUE do PostgreSQL
    if (err instanceof Error &&
        'code' in err &&
        err.code === '23505') {
        const constraint = 'constraint' in err ? String(err.constraint) : '';
        let message = 'Registro já cadastrado.';
        if (constraint.includes('email') || constraint.includes('users')) {
            message = 'E-mail já cadastrado.';
        }
        else if (constraint.includes('marca')) {
            message = 'Já existe uma marca cadastrada com este nome.';
        }
        else if (constraint.includes('role')) {
            message = 'Já existe um perfil com este nome.';
        }
        res.status(409).json({
            error: message,
        });
        return;
    }
    // Erro inesperado
    console.error('[ERRO NAO TRATADO]', err);
    res.status(500).json({
        error: 'Erro interno do servidor. Tente novamente mais tarde.',
        ...(env_1.env.nodeEnv === 'development' &&
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
function notFoundHandler(req, res) {
    res.status(404).json({
        error: `Rota nao encontrada: ${req.method} ${req.originalUrl}`,
    });
}
/**
 * Wrapper para handlers assíncronos.
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        void fn(req, res, next).catch(next);
    };
}

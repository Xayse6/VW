"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.asyncHandler = asyncHandler;
const zod_1 = require("zod");
const common_1 = require("../messages/common");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
function errorHandler(err, _req, res, _next) {
    // Erros de validação do Zod
    if (err instanceof zod_1.ZodError) {
        res.status(422).json({
            error: common_1.COMMON_ERRORS.INVALID_DATA,
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
        let message = common_1.COMMON_ERRORS.DUPLICATE_RECORD;
        if (constraint.includes('email') || constraint.includes('users')) {
            message = common_1.COMMON_ERRORS.EMAIL_ALREADY_REGISTERED;
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
        error: common_1.COMMON_ERRORS.UNEXPECTED_SERVER,
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
        error: common_1.COMMON_ERRORS.ROUTE_NOT_FOUND(req.method, req.originalUrl),
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

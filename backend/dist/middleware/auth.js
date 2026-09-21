"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireOwnership = requireOwnership;
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
/**
 * Middleware de autenticacao. Exige um header "Authorization: Bearer <token>"
 * valido para permitir o acesso a rota protegida.
 */
function requireAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError_1.AppError('Nao autenticado. Faca login para continuar.', 401);
    }
    const token = authHeader.slice('Bearer '.length).trim();
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        throw new AppError_1.AppError('Sessao invalida ou expirada. Faca login novamente.', 401);
    }
}
/**
 * Garante que o usuario autenticado so possa acessar/alterar os proprios dados.
 */
function requireOwnership(paramName = 'id') {
    return (req, _res, next) => {
        const targetId = req.params[paramName];
        if (!req.user || req.user.sub !== targetId) {
            throw new AppError_1.AppError('Voce nao tem permissao para acessar este recurso.', 403);
        }
        next();
    };
}

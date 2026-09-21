"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.requireOwnershipOrAdmin = requireOwnershipOrAdmin;
exports.requireOwnership = requireOwnership;
const auth_1 = require("../messages/auth");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
/**
 * Middleware de autenticacao. Exige um header "Authorization: Bearer <token>"
 * valido para permitir o acesso a rota protegida.
 */
function requireAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError_1.AppError(auth_1.AUTH_ERRORS.NOT_AUTHENTICATED, 401);
    }
    const token = authHeader.slice('Bearer '.length).trim();
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        throw new AppError_1.AppError(auth_1.AUTH_ERRORS.INVALID_SESSION, 401);
    }
}
/**
 * Exige que o usuário possua um dos papéis (roles) autorizados.
 */
function requireRole(allowedRoles) {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.ACCESS_DENIED, 403);
        }
        next();
    };
}
/**
 * Garante que o usuario autenticado seja admin ou o proprio dono do recurso.
 */
function requireOwnershipOrAdmin(paramName = 'id') {
    return (req, _res, next) => {
        const targetId = req.params[paramName];
        if (!req.user) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.USER_NOT_AUTHENTICATED, 401);
        }
        if (req.user.role !== 'adm' && req.user.sub !== targetId) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.OWNERSHIP_DENIED, 403);
        }
        next();
    };
}
/**
 * Garante que o usuario autenticado so possa acessar/alterar os proprios dados.
 */
function requireOwnership(paramName = 'id') {
    return (req, _res, next) => {
        const targetId = req.params[paramName];
        if (!req.user || req.user.sub !== targetId) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.OWNERSHIP_REQUIRED, 403);
        }
        next();
    };
}

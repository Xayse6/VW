"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const permissions_1 = require("./permissions");
function normalizeJwtPayload(payload) {
    return {
        ...payload,
        permissions: payload.permissions ?? (0, permissions_1.getPermissionsForRole)(payload.role),
        type: payload.type ?? 'access',
    };
}
/**
 * Assina um token JWT contendo os dados mínimos
 * necessários para identificar o usuário.
 */
function signToken(payload) {
    const fullPayload = normalizeJwtPayload(payload);
    const options = {
        expiresIn: payload.type === 'refresh'
            ? env_1.env.jwtRefreshExpiresIn
            : env_1.env.jwtAccessExpiresIn,
    };
    return jsonwebtoken_1.default.sign(fullPayload, payload.type === 'refresh' ? env_1.env.jwtRefreshSecret : env_1.env.jwtSecret, options);
}
function signAccessToken(payload) {
    return signToken({ ...payload, type: 'access' });
}
function signRefreshToken(payload) {
    return signToken({ ...payload, type: 'refresh' });
}
/**
 * Verifica e decodifica um token JWT.
 *
 * Lança erro se o token for inválido ou estiver expirado.
 */
function verifyToken(token, type = 'access') {
    const secret = type === 'refresh' ? env_1.env.jwtRefreshSecret : env_1.env.jwtSecret;
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    if (!decoded.sub || !decoded.email || !decoded.role) {
        throw new Error('Token sem claims essenciais.');
    }
    if (decoded.type && decoded.type !== type) {
        throw new Error('Tipo de token inválido para esta operação.');
    }
    return {
        ...decoded,
        permissions: decoded.permissions ?? (0, permissions_1.getPermissionsForRole)(decoded.role),
        type: decoded.type ?? type,
    };
}

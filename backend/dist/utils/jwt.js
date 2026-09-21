"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
/**
 * Assina um token JWT contendo os dados mínimos
 * necessários para identificar o usuário.
 */
function signToken(payload) {
    const options = {
        expiresIn: env_1.env.jwtExpiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, options);
}
/**
 * Verifica e decodifica um token JWT.
 *
 * Lança erro se o token for inválido ou estiver expirado.
 */
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
}

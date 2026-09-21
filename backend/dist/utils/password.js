"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
/**
 * Gera o hash de uma senha em texto puro. Nunca armazene senhas sem hash.
 */
async function hashPassword(plainPassword) {
    return bcryptjs_1.default.hash(plainPassword, SALT_ROUNDS);
}
/**
 * Compara uma senha em texto puro com um hash armazenado.
 */
async function comparePassword(plainPassword, hash) {
    return bcryptjs_1.default.compare(plainPassword, hash);
}

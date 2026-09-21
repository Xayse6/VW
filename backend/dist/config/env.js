"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const system_1 = require("../messages/system");
function requiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(system_1.SYSTEM_MESSAGES.ENV_MISSING(name));
    }
    return value;
}
exports.env = {
    port: Number(process.env.PORT) || 3333,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: requiredEnv('DATABASE_URL'),
    jwtSecret: requiredEnv('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    corsOrigin: process.env.CORS_ORIGIN
        ? (process.env.CORS_ORIGIN.includes(',')
            ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
            : process.env.CORS_ORIGIN)
        : ['http://localhost:5173', 'http://localhost:80', 'http://localhost'],
};

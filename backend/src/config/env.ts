import 'dotenv/config';

import { SYSTEM_MESSAGES } from '../messages/system';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      SYSTEM_MESSAGES.ENV_MISSING(name)
    );
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3333,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  seedDatabase: process.env.SEED_DATABASE
    ? process.env.SEED_DATABASE === 'true'
    : process.env.NODE_ENV !== 'production',
  databaseUrl: requiredEnv('DATABASE_URL'),
  jwtSecret: requiredEnv('JWT_SECRET'),
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || requiredEnv('JWT_SECRET'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigin: process.env.CORS_ORIGIN
    ? (process.env.CORS_ORIGIN.includes(',')
        ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
        : process.env.CORS_ORIGIN)
    : [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:4173',
        'http://localhost:3000',
        'http://localhost:80',
        'http://localhost',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://127.0.0.1:3000',
      ],
};
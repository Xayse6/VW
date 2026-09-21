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
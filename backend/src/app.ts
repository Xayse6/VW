import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  type Application,
} from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env';

import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import marcaRoutes from './routes/marcaRoutes';
import modeloRoutes from './routes/modeloRoutes';

export function createApp(): Application {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({
    crossOriginResourcePolicy: false,
  }));
  app.use(cookieParser());

  const allowedOrigins = Array.isArray(env.corsOrigin)
    ? env.corsOrigin
    : [env.corsOrigin];

  app.use(cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (env.nodeEnv === 'development' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))
      ) {
        callback(null, true);
        return;
      }

      callback(new Error('Origem não permitida pelo CORS.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  }));

  app.use(
    express.json({
      limit: '1mb',
    })
  );

  app.use('/api/auth', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      code: 'TOO_MANY_REQUESTS',
      message: 'Muitas tentativas de autenticação. Tente novamente mais tarde.',
    },
  }));

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/marcas', marcaRoutes);
  app.use('/api/modelos', modeloRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
import cors from 'cors';
import express, {
  type Application,
} from 'express';

import { env } from './config/env';

import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import marcarRoutes from './routes/marcaRoutes';

export function createApp(): Application {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );

  app.use(
    express.json({
      limit: '1mb',
    })
  );

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/marcas', marcarRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
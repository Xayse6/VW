import { Router } from 'express';

import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * Cadastro
 */
router.post(
  '/register',
  asyncHandler(AuthController.register)
);

/**
 * Login
 */
router.post(
  '/login',
  asyncHandler(AuthController.login)
);

/**
 * Usuario autenticado
 */
router.get(
  '/me',
  requireAuth,
  asyncHandler(AuthController.me)
);

export default router;
import { Router } from 'express';

import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  asyncHandler(AuthController.register)
);

router.post(
  '/login',
  asyncHandler(AuthController.login)
);

router.post(
  '/refresh',
  asyncHandler(AuthController.refresh)
);

router.post(
  '/logout',
  asyncHandler(AuthController.logout)
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(AuthController.me)
);

export default router;
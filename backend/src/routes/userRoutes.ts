import { Router } from 'express';

import { UserController } from '../controllers/userController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(UserController.list)
);

router.get(
  '/:id',
  requireAuth,
  asyncHandler(UserController.getById)
);

router.put(
  '/:id',
  requireAuth,
  asyncHandler(UserController.update)
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(UserController.remove)
);

export default router;
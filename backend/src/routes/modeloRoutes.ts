import { Router } from 'express';

import { ModeloController } from '../controllers/modeloController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get(
  '/',
  asyncHandler(ModeloController.list)
);

router.post(
  '/cadastroModelo',
  requireAuth,
  asyncHandler(ModeloController.register)
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(
    ModeloController.getById
  )
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(ModeloController.update)
);


export default router;
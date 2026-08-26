import { Router } from 'express';

import { MarcaController } from '../controllers/marcaController.ts';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get(
  '/',
  asyncHandler(MarcaController.list)
);

router.post(
  '/cadastroMarca',
  asyncHandler(MarcaController.register)
);


export default router;
import { Router } from 'express';
import { ModeloController } from '../controllers/modeloController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', asyncHandler(ModeloController.list));
router.get('/:id', asyncHandler(ModeloController.getById));

// Suporte para POST padrão REST e legado
router.post('/', requireAuth, asyncHandler(ModeloController.register));
router.post('/cadastroModelo', requireAuth, asyncHandler(ModeloController.register));

router.put('/:id', requireAuth, asyncHandler(ModeloController.update));
router.delete('/:id', requireAuth, asyncHandler(ModeloController.remove));

export default router;
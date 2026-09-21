import { Router } from 'express';
import { MarcaController } from '../controllers/marcaController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', asyncHandler(MarcaController.list));
router.get('/:id', asyncHandler(MarcaController.getById));

// Suporte para POST padrão REST e legado
router.post('/', requireAuth, asyncHandler(MarcaController.register));
router.post('/cadastroMarca', requireAuth, asyncHandler(MarcaController.register));

router.put('/:id', requireAuth, asyncHandler(MarcaController.update));
router.delete('/:id', requireAuth, asyncHandler(MarcaController.remove));

export default router;
import { Router } from 'express';
import { MarcaController } from '../controllers/marcaController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', asyncHandler(MarcaController.list));
router.get('/:id', asyncHandler(MarcaController.getById));

router.post('/', requireAuth, requireRole(['adm']), asyncHandler(MarcaController.register));
router.put('/:id', requireAuth, requireRole(['adm']), asyncHandler(MarcaController.update));
router.delete('/:id', requireAuth, requireRole(['adm']), asyncHandler(MarcaController.remove));

export default router;
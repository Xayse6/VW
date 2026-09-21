import { Router } from 'express';
import { ModeloController } from '../controllers/modeloController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', asyncHandler(ModeloController.list));
router.get('/:id', asyncHandler(ModeloController.getById));

router.post('/', requireAuth, requireRole(['adm']), asyncHandler(ModeloController.register));
router.put('/:id', requireAuth, requireRole(['adm']), asyncHandler(ModeloController.update));
router.delete('/:id', requireAuth, requireRole(['adm']), asyncHandler(ModeloController.remove));

export default router;
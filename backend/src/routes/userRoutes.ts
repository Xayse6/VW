import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth, requireOwnershipOrAdmin, requireRole } from '../middleware/auth';

const router = Router();

// Apenas administradores podem listar todos os usuários
router.get(
  '/',
  requireAuth,
  requireRole(['adm']),
  asyncHandler(UserController.list)
);

// Obter dados do usuário (próprio usuário ou admin)
router.get(
  '/:id',
  requireAuth,
  requireOwnershipOrAdmin('id'),
  asyncHandler(UserController.getById)
);

// Atualizar dados (próprio usuário ou admin)
router.put(
  '/:id',
  requireAuth,
  requireOwnershipOrAdmin('id'),
  asyncHandler(UserController.update)
);

// Excluir conta (apenas admin)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['adm']),
  asyncHandler(UserController.remove)
);

// Promover para admin (apenas admin)
router.patch(
  '/:id/promote',
  requireAuth,
  requireRole(['adm']),
  asyncHandler(UserController.promoteToAdmin)
);

export default router;
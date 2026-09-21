"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apenas administradores podem listar todos os usuários
router.get('/', auth_1.requireAuth, (0, auth_1.requireRole)(['adm']), (0, errorHandler_1.asyncHandler)(userController_1.UserController.list));
// Obter dados do usuário (próprio usuário ou admin)
router.get('/:id', auth_1.requireAuth, (0, auth_1.requireOwnershipOrAdmin)('id'), (0, errorHandler_1.asyncHandler)(userController_1.UserController.getById));
// Atualizar dados (próprio usuário ou admin)
router.put('/:id', auth_1.requireAuth, (0, auth_1.requireOwnershipOrAdmin)('id'), (0, errorHandler_1.asyncHandler)(userController_1.UserController.update));
// Excluir conta (apenas admin)
router.delete('/:id', auth_1.requireAuth, (0, auth_1.requireRole)(['adm']), (0, errorHandler_1.asyncHandler)(userController_1.UserController.remove));
// Promover para admin (apenas admin)
router.patch('/:id/promote', auth_1.requireAuth, (0, auth_1.requireRole)(['adm']), (0, errorHandler_1.asyncHandler)(userController_1.UserController.promoteToAdmin));
exports.default = router;

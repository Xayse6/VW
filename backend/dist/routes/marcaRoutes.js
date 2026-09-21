"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marcaController_1 = require("../controllers/marcaController");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(marcaController_1.MarcaController.list));
router.get('/:id', (0, errorHandler_1.asyncHandler)(marcaController_1.MarcaController.getById));
// Suporte para POST padrão REST e legado
router.post('/', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(marcaController_1.MarcaController.register));
router.post('/cadastroMarca', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(marcaController_1.MarcaController.register));
router.put('/:id', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(marcaController_1.MarcaController.update));
router.delete('/:id', auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(marcaController_1.MarcaController.remove));
exports.default = router;

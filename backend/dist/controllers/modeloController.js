"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeloController = void 0;
const Modelo_1 = require("../model/Modelo");
const AppError_1 = require("../utils/AppError");
const validation_1 = require("../utils/validation");
exports.ModeloController = {
    async list(_req, res) {
        const modelos = await Modelo_1.ModeloModel.findAll();
        res.status(200).json({
            modelos: modelos.map(Modelo_1.ModeloModel.toPublic),
        });
    },
    async getById(req, res) {
        const id = req.params.id;
        if (typeof id !== 'string') {
            throw new AppError_1.AppError('ID inválido.', 400);
        }
        const modelo = await Modelo_1.ModeloModel.findById(id);
        if (!modelo) {
            throw new AppError_1.AppError('Modelo não encontrado.', 404);
        }
        res.status(200).json({
            modelo: Modelo_1.ModeloModel.toPublic(modelo),
        });
    },
    async register(req, res) {
        const data = validation_1.createModeloSchema.parse(req.body);
        const modelo = await Modelo_1.ModeloModel.create({
            id_marca: data.id_marca,
            nome_modelo: data.nome_modelo,
            ano_modelo: data.ano_modelo,
        });
        res.status(201).json({
            message: 'Modelo cadastrado com sucesso.',
            modelo: Modelo_1.ModeloModel.toPublic(modelo),
        });
    },
    async update(req, res) {
        const id = req.params.id;
        if (typeof id !== 'string') {
            throw new AppError_1.AppError('ID inválido.', 400);
        }
        const data = validation_1.updateModeloSchema.parse(req.body);
        const existing = await Modelo_1.ModeloModel.findById(id);
        if (!existing) {
            throw new AppError_1.AppError('Modelo não encontrado.', 404);
        }
        const updated = await Modelo_1.ModeloModel.update(id, {
            id_marca: data.id_marca,
            nome_modelo: data.nome_modelo,
            ano_modelo: data.ano_modelo,
        });
        if (!updated) {
            throw new AppError_1.AppError('Não foi possível atualizar o modelo.', 500);
        }
        res.status(200).json({
            message: 'Modelo atualizado com sucesso.',
            modelo: Modelo_1.ModeloModel.toPublic(updated),
        });
    },
    async remove(req, res) {
        const id = req.params.id;
        if (typeof id !== 'string') {
            throw new AppError_1.AppError('ID inválido.', 400);
        }
        const deleted = await Modelo_1.ModeloModel.delete(id);
        if (!deleted) {
            throw new AppError_1.AppError('Modelo não encontrado.', 404);
        }
        res.status(200).json({
            message: 'Modelo excluído com sucesso.',
        });
    },
};

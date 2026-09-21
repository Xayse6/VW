"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaController = void 0;
const marca_1 = require("../messages/marca");
const success_1 = require("../messages/success");
const Marca_1 = require("../model/Marca");
const AppError_1 = require("../utils/AppError");
const validation_1 = require("../utils/validation");
exports.MarcaController = {
    async list(_req, res) {
        const marcas = await Marca_1.MarcaModel.findAll();
        res.status(200).json({
            marcas: marcas.map(Marca_1.MarcaModel.toPublic),
        });
    },
    async getById(req, res) {
        const id = req.params.id;
        if (typeof id !== 'string') {
            throw new AppError_1.AppError(marca_1.MARCA_ERRORS.INVALID_ID, 400);
        }
        const marca = await Marca_1.MarcaModel.findById(id);
        if (!marca) {
            throw new AppError_1.AppError(marca_1.MARCA_ERRORS.NOT_FOUND, 404);
        }
        res.status(200).json({
            marca: Marca_1.MarcaModel.toPublic(marca),
        });
    },
    async register(req, res) {
        const data = validation_1.createMarcaSchema.parse(req.body);
        const marca = await Marca_1.MarcaModel.create({
            nome_marca: data.nome_marca,
        });
        res.status(201).json({
            message: success_1.SUCCESS_MESSAGES.MARCA_CREATED,
            marca: Marca_1.MarcaModel.toPublic(marca),
        });
    },
    async update(req, res) {
        const id_marca = req.params.id;
        if (typeof id_marca !== 'string') {
            throw new AppError_1.AppError(marca_1.MARCA_ERRORS.INVALID_ID, 400);
        }
        const data = validation_1.updateMarcaSchema.parse(req.body);
        const marca = await Marca_1.MarcaModel.findById(id_marca);
        if (!marca) {
            throw new AppError_1.AppError(marca_1.MARCA_ERRORS.NOT_FOUND, 404);
        }
        const updated = await Marca_1.MarcaModel.update(id_marca, {
            nome_marca: data.nome_marca,
        });
        if (!updated) {
            throw new AppError_1.AppError(marca_1.MARCA_ERRORS.UPDATE_FAILED, 500);
        }
        res.status(200).json({
            message: success_1.SUCCESS_MESSAGES.MARCA_UPDATED,
            marca: Marca_1.MarcaModel.toPublic(updated),
        });
    },
    async remove(req, res) {
        const id_marca = req.params.id;
        if (typeof id_marca !== 'string') {
            throw new AppError_1.AppError(marca_1.MARCA_ERRORS.INVALID_ID, 400);
        }
        const deleted = await Marca_1.MarcaModel.delete(id_marca);
        if (!deleted) {
            throw new AppError_1.AppError(marca_1.MARCA_ERRORS.NOT_FOUND, 404);
        }
        res.status(200).json({
            message: success_1.SUCCESS_MESSAGES.MARCA_DELETED,
        });
    },
    async all(_req, res) {
        const marcas = await Marca_1.MarcaModel.findAll();
        res.status(200).json({
            marcas: marcas.map(Marca_1.MarcaModel.toPublic),
        });
    },
};

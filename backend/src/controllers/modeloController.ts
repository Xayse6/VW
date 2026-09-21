import type { Request, Response } from 'express';
import { MODELO_ERRORS } from '../messages/modelo';
import { SUCCESS_MESSAGES } from '../messages/success';
import { ModeloModel } from '../model/Modelo';
import { AppError } from '../utils/AppError';
import { createModeloSchema, updateModeloSchema } from '../utils/validation';

export const ModeloController = {
  async list(_req: Request, res: Response): Promise<void> {
    const modelos = await ModeloModel.findAll();

    res.status(200).json({
      modelos: modelos.map(ModeloModel.toPublic),
    });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== 'string') {
      throw new AppError(MODELO_ERRORS.INVALID_ID, 400);
    }

    const modelo = await ModeloModel.findById(id);

    if (!modelo) {
      throw new AppError(MODELO_ERRORS.NOT_FOUND, 404);
    }

    res.status(200).json({
      modelo: ModeloModel.toPublic(modelo),
    });
  },

  async register(req: Request, res: Response): Promise<void> {
    const data = createModeloSchema.parse(req.body);

    const modelo = await ModeloModel.create({
      id_marca: data.id_marca,
      nome_modelo: data.nome_modelo,
      ano_modelo: data.ano_modelo,
    });

    res.status(201).json({
      message: SUCCESS_MESSAGES.MODELO_CREATED,
      modelo: ModeloModel.toPublic(modelo),
    });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== 'string') {
      throw new AppError(MODELO_ERRORS.INVALID_ID, 400);
    }

    const data = updateModeloSchema.parse(req.body);

    const existing = await ModeloModel.findById(id);
    if (!existing) {
      throw new AppError(MODELO_ERRORS.NOT_FOUND, 404);
    }

    const updated = await ModeloModel.update(id, {
      id_marca: data.id_marca,
      nome_modelo: data.nome_modelo,
      ano_modelo: data.ano_modelo,
    });

    if (!updated) {
      throw new AppError(MODELO_ERRORS.UPDATE_FAILED, 500);
    }

    res.status(200).json({
      message: SUCCESS_MESSAGES.MODELO_UPDATED,
      modelo: ModeloModel.toPublic(updated),
    });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== 'string') {
      throw new AppError(MODELO_ERRORS.INVALID_ID, 400);
    }

    const deleted = await ModeloModel.delete(id);

    if (!deleted) {
      throw new AppError(MODELO_ERRORS.NOT_FOUND, 404);
    }

    res.status(200).json({
      message: SUCCESS_MESSAGES.MODELO_DELETED,
    });
  },
};

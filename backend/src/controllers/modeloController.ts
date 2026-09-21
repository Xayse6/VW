import type { Request, Response } from 'express';
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
      throw new AppError('ID inválido.', 400);
    }

    const modelo = await ModeloModel.findById(id);

    if (!modelo) {
      throw new AppError('Modelo não encontrado.', 404);
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
      message: 'Modelo cadastrado com sucesso.',
      modelo: ModeloModel.toPublic(modelo),
    });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== 'string') {
      throw new AppError('ID inválido.', 400);
    }

    const data = updateModeloSchema.parse(req.body);

    const existing = await ModeloModel.findById(id);
    if (!existing) {
      throw new AppError('Modelo não encontrado.', 404);
    }

    const updated = await ModeloModel.update(id, {
      id_marca: data.id_marca,
      nome_modelo: data.nome_modelo,
      ano_modelo: data.ano_modelo,
    });

    if (!updated) {
      throw new AppError('Não foi possível atualizar o modelo.', 500);
    }

    res.status(200).json({
      message: 'Modelo atualizado com sucesso.',
      modelo: ModeloModel.toPublic(updated),
    });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== 'string') {
      throw new AppError('ID inválido.', 400);
    }

    const deleted = await ModeloModel.delete(id);

    if (!deleted) {
      throw new AppError('Modelo não encontrado.', 404);
    }

    res.status(200).json({
      message: 'Modelo excluído com sucesso.',
    });
  },
};

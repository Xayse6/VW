import type { Request, Response } from 'express';
import { MarcaModel } from '../model/Marca';
import { AppError } from '../utils/AppError';
import { createMarcaSchema, updateMarcaSchema } from '../utils/validation';

export const MarcaController = {
  async list(_req: Request, res: Response): Promise<void> {
    const marcas = await MarcaModel.findAll();

    res.status(200).json({
      marcas: marcas.map(MarcaModel.toPublic),
    });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== 'string') {
      throw new AppError('ID inválido.', 400);
    }

    const marca = await MarcaModel.findById(id);

    if (!marca) {
      throw new AppError('Marca não encontrada.', 404);
    }

    res.status(200).json({
      marca: MarcaModel.toPublic(marca),
    });
  },

  async register(req: Request, res: Response): Promise<void> {
    const data = createMarcaSchema.parse(req.body);

    const marca = await MarcaModel.create({
      nome_marca: data.nome_marca,
    });

    res.status(201).json({
      message: 'Marca cadastrada com sucesso.',
      marca: MarcaModel.toPublic(marca),
    });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id_marca = req.params.id;

    if (typeof id_marca !== 'string') {
      throw new AppError('ID inválido.', 400);
    }

    const data = updateMarcaSchema.parse(req.body);

    const marca = await MarcaModel.findById(id_marca);
    if (!marca) {
      throw new AppError('Marca não encontrada.', 404);
    }

    const updated = await MarcaModel.update(id_marca, {
      nome_marca: data.nome_marca,
    });

    if (!updated) {
      throw new AppError('Não foi possível atualizar a marca.', 500);
    }

    res.status(200).json({
      message: 'Marca atualizada com sucesso.',
      marca: MarcaModel.toPublic(updated),
    });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id_marca = req.params.id;

    if (typeof id_marca !== 'string') {
      throw new AppError('ID inválido.', 400);
    }

    const deleted = await MarcaModel.delete(id_marca);

    if (!deleted) {
      throw new AppError('Marca não encontrada.', 404);
    }

    res.status(200).json({
      message: 'Marca excluída com sucesso.',
    });
  },

  async all(_req: Request, res: Response): Promise<void> {
    const marcas = await MarcaModel.findAll();
    res.status(200).json({
      marcas: marcas.map(MarcaModel.toPublic),
    });
  },
};

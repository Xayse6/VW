import type {
  Request,
  Response,
} from 'express';

import { ModeloModel } from "../model/Modelo";

import { AppError } from '../utils/AppError';

export const ModeloController = {
    
  async list(
    _req: Request,
    res: Response
  ): Promise<void> {
    const modelos = await ModeloModel.findAll();

    res.status(200).json({
      modelos: modelos.map(
        ModeloModel.toPublic
      ),
    });
  },

async getById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  if (typeof id !== "string") {
    res.status(400).json({
      error: "ID inválido.",
    });
    return;
  }

  const modelo =
    await ModeloModel.findById(id);

  if (!modelo) {
    res.status(404).json({
      error: "Modelo não encontrado.",
    });
    return;
  }

  res.status(200).json({
    modelo:
      ModeloModel.toPublic(modelo),
  });
},

async register(
  req: Request,
  res: Response
): Promise<void> {
  const {
    id_marca,
    nome_modelo,
    ano_modelo,
  } = req.body;

  const modelo =
    await ModeloModel.create({
      id_marca,
      nome_modelo,
      ano_modelo,
    });

  res.status(201).json({
    message: "Modelo cadastrado com sucesso.",
    modelo: ModeloModel.toPublic(modelo),
  });
}
};

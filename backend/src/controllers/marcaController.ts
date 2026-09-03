import type {
  Request,
  Response,
} from 'express';

import { MarcaModel } from "../model/Marca";

import { AppError } from '../utils/AppError';

export const MarcaController = {
    
  async list(
    _req: Request,
    res: Response
  ): Promise<void> {
    const marcas = await MarcaModel.findAll();

    res.status(200).json({
      marcas: marcas.map(
        MarcaModel.toPublic
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

  const marca =
    await MarcaModel.findById(id);

  if (!marca) {
    res.status(404).json({
      error: "Marca não encontrada.",
    });
    return;
  }

  res.status(200).json({
    marca:
      MarcaModel.toPublic(marca),
  });
},

  async register(
    req: Request,
    res: Response
  ): Promise<void> {
    const { nome_marca } = req.body;

    const marca = await MarcaModel.create({
      nome_marca,
    });

    res.status(201).json({
      message: "Marca cadastrada com sucesso.",
      marca: MarcaModel.toPublic(marca),
    });
  },

    async all(
    _req: Request,
    res: Response
  ): Promise<void> {
    const marcas = await MarcaModel.findAll();
  
    console.log(marcas);
  
    res.status(200).json({ marcas });
  },

  async update(
  req: Request,
  res: Response
): Promise<void> {
  const id_marca = String(req.params.id);

  const { nome_marca } = req.body;

  const marca =
    await MarcaModel.findById(
      id_marca
    );

  if (!marca) {
    throw new AppError(
      "Marca não encontrada.",
      404
    );
  }

const updated =
  await MarcaModel.update(
    id_marca,
    {
      nome_marca,
    }
  );

if (!updated) {
  throw new AppError(
    "Não foi possível atualizar a marca.",
    500
  );
}

res.status(200).json({
  message: "Marca atualizada com sucesso.",
  marca: MarcaModel.toPublic(updated),
});
},
};

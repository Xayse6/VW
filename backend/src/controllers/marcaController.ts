import type {
  Request,
  Response,
} from "express";

import { MarcaModel } from "../models/MarcaModel";

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
  async register(
    req: Request,
    res: Response
  ): Promise<void> {
    const {
      nome_marca,
      sigla_marca,
    } = req.body;

    const marca = await MarcaModel.create({
      nome_marca,
      sigla_marca,
    });

    res.status(201).json({
      message: "Marca cadastrada com sucesso.",
      marca: MarcaModel.toPublic(marca),
    });
  },
};

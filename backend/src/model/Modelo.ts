  import { pool } from '../db/database';


import type {ModeloRecord, PublicModelo} from '../types/modelos';


export const ModeloModel = {
async create(params: {
  id_marca: string;
  nome_modelo: string;
  ano_modelo: number;
}): Promise<ModeloRecord> {

  const result = await pool.query<ModeloRecord>(
      `
      INSERT INTO modelos (
        id_marca,
        nome_modelo,
        ano_modelo
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING
        id_modelo,
        id_marca,
        nome_modelo,
        ano_modelo
      `,
      [
        params.id_marca,
        params.nome_modelo,
        params.ano_modelo,
      ]
    );

  return result.rows[0];
},

async findById(
  id_modelo: string
): Promise<ModeloRecord | undefined> {
  const result =
    await pool.query<ModeloRecord>(
      `
      SELECT
        id_modelo,
        id_marca,
        nome_modelo,
        ano_modelo
      FROM modelos
      WHERE id_modelo = $1
      `,
      [id_modelo]
    );

  return result.rows[0];
},

async findAll(): Promise<ModeloRecord[]> {
  const result =
    await pool.query<ModeloRecord>(
      `
      SELECT
        mo.id_modelo,
        mo.nome_modelo,
        mo.ano_modelo,
        ma.id_marca,
        ma.nome_marca
        FROM modelos mo
        INNER JOIN marcas ma
        ON ma.id_marca = mo.id_marca
        ORDER BY ma.nome_marca, mo.nome_modelo
      `
    );

  return result.rows;
},

  async update(
  id_marca: string,
  params: {
    nome_marca?: string;
  }
): Promise<MarcaRecord | undefined> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (params.nome_marca !== undefined) {
    values.push(params.nome_marca);

    fields.push(
      `nome_marca = $${values.length}`
    );
  }

  if (fields.length === 0) {
    return this.findById(id_marca);
  }

  values.push(id_marca);

  const result =
    await pool.query<MarcaRecord>(
      `
      UPDATE marcas
      SET
        ${fields.join(", ")}
      WHERE id_marca = $${values.length}
      RETURNING
        id_marca,
        nome_marca
      `,
      values
    );

  return result.rows[0];
},

toPublic(
  modelo: ModeloRecord
): PublicModelo {
  return {
    id_modelo: modelo.id_modelo,
    id_marca: modelo.id_marca,
    nome_marca: modelo.nome_marca,
    nome_modelo: modelo.nome_modelo,
    ano_modelo: modelo.ano_modelo,
  };
},
}
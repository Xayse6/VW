  import { pool } from '../db/database';


import type {MarcaRecord, PublicMarca} from '../types/marcas';


export const MarcaModel = {
  async create(params: {
    nome_marca: string;
  }): Promise<MarcaRecord> {

    const result =
      await pool.query<MarcaRecord>(
        `
        INSERT INTO marcas (
          nome_marca
        )
        VALUES (
          $1
        )
        RETURNING
          id_marca,
          nome_marca
        `,
        [
          params.nome_marca,
        ]
      );

    return result.rows[0];
  },

  async findById(
  id_marca: string
): Promise<MarcaRecord | undefined> {
  const result =
    await pool.query<MarcaRecord>(
      `
      SELECT
        id_marca,
        nome_marca
      FROM marcas
      WHERE id_marca = $1
      `,
      [id_marca]
    );

  return result.rows[0];
},

  async findAll(): Promise<MarcaRecord[]> {
    const result = await pool.query<MarcaRecord>(
      `
      SELECT
        id_marca,
        nome_marca
      FROM marcas
      ORDER BY nome_marca
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
    marca: MarcaRecord
  ): PublicMarca{
    return {
      id_marca: marca.id_marca,
      nome_marca: marca.nome_marca,
    };
  },
}
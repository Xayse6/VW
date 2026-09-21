import { pool } from '../db/database';
import type { ModeloRecord, PublicModelo } from '../types/modelos';

export const ModeloModel = {
  async create(params: {
    id_marca: string;
    nome_modelo: string;
    ano_modelo: number;
  }): Promise<ModeloRecord> {
    const insertResult = await pool.query<{ id_modelo: string }>(
      `
      INSERT INTO modelos (
        id_marca,
        nome_modelo,
        ano_modelo
      )
      VALUES ($1, $2, $3)
      RETURNING id_modelo
      `,
      [params.id_marca, params.nome_modelo, params.ano_modelo]
    );

    const created = await this.findById(insertResult.rows[0].id_modelo);
    if (!created) {
      throw new Error('Falha ao recuperar modelo recém-criado.');
    }

    return created;
  },

  async findById(id_modelo: string): Promise<ModeloRecord | undefined> {
    const result = await pool.query<ModeloRecord>(
      `
      SELECT
        mo.id_modelo,
        mo.id_marca,
        mo.nome_modelo,
        mo.ano_modelo,
        ma.nome_marca
      FROM modelos mo
      INNER JOIN marcas ma
        ON ma.id_marca = mo.id_marca
      WHERE mo.id_modelo = $1
      `,
      [id_modelo]
    );

    return result.rows[0];
  },

  async findAll(): Promise<ModeloRecord[]> {
    const result = await pool.query<ModeloRecord>(
      `
      SELECT
        mo.id_modelo,
        mo.id_marca,
        mo.nome_modelo,
        mo.ano_modelo,
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
    id_modelo: string,
    params: {
      id_marca?: string;
      nome_modelo?: string;
      ano_modelo?: number;
    }
  ): Promise<ModeloRecord | undefined> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (params.id_marca !== undefined) {
      values.push(params.id_marca);
      fields.push(`id_marca = $${values.length}`);
    }

    if (params.nome_modelo !== undefined) {
      values.push(params.nome_modelo);
      fields.push(`nome_modelo = $${values.length}`);
    }

    if (params.ano_modelo !== undefined) {
      values.push(params.ano_modelo);
      fields.push(`ano_modelo = $${values.length}`);
    }

    if (fields.length === 0) {
      return this.findById(id_modelo);
    }

    values.push(id_modelo);

    await pool.query(
      `
      UPDATE modelos
      SET ${fields.join(', ')}
      WHERE id_modelo = $${values.length}
      `,
      values
    );

    return this.findById(id_modelo);
  },

  async delete(id_modelo: string): Promise<boolean> {
    const result = await pool.query(
      `
      DELETE FROM modelos
      WHERE id_modelo = $1
      `,
      [id_modelo]
    );

    return (result.rowCount ?? 0) > 0;
  },

  toPublic(modelo: ModeloRecord): PublicModelo {
    return {
      id_modelo: modelo.id_modelo,
      id_marca: modelo.id_marca,
      nome_marca: modelo.nome_marca,
      nome_modelo: modelo.nome_modelo,
      ano_modelo: modelo.ano_modelo,
    };
  },
};
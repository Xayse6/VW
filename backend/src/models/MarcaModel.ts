  import { pool } from '../db/database';


import type {MarcaRecord, PublicMarca} from '../types/marcas';


export const MarcaModel = {
      async create(params: {
        nome_marca: string;
        sigla_marca: string;
      }): Promise<MarcaRecord> {
        const result =
          await pool.query<MarcaRecord>(
            `
            INSERT INTO marcas (
              nome_marca,
              sigla_marca
            )
            RETURNING
              id_usuario,
              nome_marca,
              sigla_marca
            `,
            [
              params.nome_marca,
              params.sigla_marca,
            ]
          );
    
        return result.rows[0];
      },
    async findAll(): Promise<MarcaRecord[]> {
    const result =
      await pool.query<MarcaRecord>(
        `
        SELECT
          nome_marca,
          sigla_marca
        FROM marcas
        `
      );

    return result.rows;
  },

  toPublic(
    marca: MarcaRecord
  ): PublicMarca {
    return {
      nome_marca: marca.nome_marca,
      sigla_marca: marca.sigla_marca,
    };
  },
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaModel = void 0;
const database_1 = require("../db/database");
exports.MarcaModel = {
    async create(params) {
        const result = await database_1.pool.query(`
        INSERT INTO marcas (
          nome_marca
        )
        VALUES (
          $1
        )
        RETURNING
          id_marca,
          nome_marca
        `, [
            params.nome_marca,
        ]);
        return result.rows[0];
    },
    async findById(id_marca) {
        const result = await database_1.pool.query(`
      SELECT
        id_marca,
        nome_marca
      FROM marcas
      WHERE id_marca = $1
      `, [id_marca]);
        return result.rows[0];
    },
    async findAll() {
        const result = await database_1.pool.query(`
      SELECT
        id_marca,
        nome_marca
      FROM marcas
      ORDER BY nome_marca
      `);
        return result.rows;
    },
    async update(id_marca, params) {
        const fields = [];
        const values = [];
        if (params.nome_marca !== undefined) {
            values.push(params.nome_marca);
            fields.push(`nome_marca = $${values.length}`);
        }
        if (fields.length === 0) {
            return this.findById(id_marca);
        }
        values.push(id_marca);
        const result = await database_1.pool.query(`
      UPDATE marcas
      SET
        ${fields.join(", ")}
      WHERE id_marca = $${values.length}
      RETURNING
        id_marca,
        nome_marca
      `, values);
        return result.rows[0];
    },
    async delete(id_marca) {
        const result = await database_1.pool.query(`
      DELETE FROM marcas
      WHERE id_marca = $1
      `, [id_marca]);
        return (result.rowCount ?? 0) > 0;
    },
    toPublic(marca) {
        return {
            id_marca: marca.id_marca,
            nome_marca: marca.nome_marca,
        };
    },
};

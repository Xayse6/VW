"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeloModel = void 0;
const database_1 = require("../db/database");
const system_1 = require("../messages/system");
exports.ModeloModel = {
    async create(params) {
        const insertResult = await database_1.pool.query(`
      INSERT INTO modelos (
        id_marca,
        nome_modelo,
        ano_modelo
      )
      VALUES ($1, $2, $3)
      RETURNING id_modelo
      `, [params.id_marca, params.nome_modelo, params.ano_modelo]);
        const created = await this.findById(insertResult.rows[0].id_modelo);
        if (!created) {
            throw new Error(system_1.SYSTEM_MESSAGES.MODELO_CREATE_FAILED);
        }
        return created;
    },
    async findById(id_modelo) {
        const result = await database_1.pool.query(`
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
      `, [id_modelo]);
        return result.rows[0];
    },
    async findAll() {
        const result = await database_1.pool.query(`
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
      `);
        return result.rows;
    },
    async update(id_modelo, params) {
        const fields = [];
        const values = [];
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
        await database_1.pool.query(`
      UPDATE modelos
      SET ${fields.join(', ')}
      WHERE id_modelo = $${values.length}
      `, values);
        return this.findById(id_modelo);
    },
    async delete(id_modelo) {
        const result = await database_1.pool.query(`
      DELETE FROM modelos
      WHERE id_modelo = $1
      `, [id_modelo]);
        return (result.rowCount ?? 0) > 0;
    },
    toPublic(modelo) {
        return {
            id_modelo: modelo.id_modelo,
            id_marca: modelo.id_marca,
            nome_marca: modelo.nome_marca,
            nome_modelo: modelo.nome_modelo,
            ano_modelo: modelo.ano_modelo,
        };
    },
};

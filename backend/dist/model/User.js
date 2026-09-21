"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../db/database");
const system_1 = require("../messages/system");
exports.UserModel = {
    async create(params) {
        const insertResult = await database_1.pool.query(`
      INSERT INTO users (
        nome_usuario,
        email_usuario,
        password_hash,
        id_role
      )
      VALUES (
        $1,
        $2,
        $3,
        (
          SELECT id_role
          FROM roles
          WHERE nome_role = 'client'
        )
      )
      RETURNING id_usuario
      `, [params.nome_usuario, params.email_usuario, params.password_hash]);
        const user = await this.findById(insertResult.rows[0].id_usuario);
        if (!user) {
            throw new Error(system_1.SYSTEM_MESSAGES.USER_CREATE_FAILED);
        }
        return user;
    },
    async promoteToAdmin(id_usuario) {
        const result = await database_1.pool.query(`
      UPDATE users
      SET
        id_role = (
          SELECT id_role
          FROM roles
          WHERE nome_role = 'adm'
        ),
        updated_at_usuario = NOW()
      WHERE id_usuario = $1
      `, [id_usuario]);
        if ((result.rowCount ?? 0) === 0) {
            return undefined;
        }
        return this.findById(id_usuario);
    },
    async findById(id_usuario) {
        const result = await database_1.pool.query(`
        SELECT
          u.id_usuario,
          u.nome_usuario,
          u.email_usuario,
          u.password_hash,
          u.id_role,
          r.nome_role,
          u.created_at_usuario,
          u.updated_at_usuario
        FROM users u
        INNER JOIN roles r
          ON r.id_role = u.id_role
        WHERE u.id_usuario = $1
        `, [id_usuario]);
        return result.rows[0];
    },
    async findByEmail(email_usuario) {
        const result = await database_1.pool.query(`
        SELECT
          u.id_usuario,
          u.nome_usuario,
          u.email_usuario,
          u.password_hash,
          u.id_role,
          r.nome_role,
          u.created_at_usuario,
          u.updated_at_usuario
        FROM users u
        INNER JOIN roles r
          ON r.id_role = u.id_role
        WHERE u.email_usuario = $1
        `, [email_usuario]);
        return result.rows[0];
    },
    async findAll() {
        const result = await database_1.pool.query(`
        SELECT
          u.id_usuario,
          u.nome_usuario,
          u.email_usuario,
          u.password_hash,
          u.id_role,
          r.nome_role,
          u.created_at_usuario,
          u.updated_at_usuario
        FROM users u
        INNER JOIN roles r
          ON r.id_role = u.id_role
        ORDER BY u.created_at_usuario DESC
        `);
        return result.rows;
    },
    async update(id_usuario, params) {
        const fields = [];
        const values = [];
        if (params.nome_usuario !== undefined) {
            values.push(params.nome_usuario);
            fields.push(`nome_usuario = $${values.length}`);
        }
        if (params.email_usuario !== undefined) {
            values.push(params.email_usuario);
            fields.push(`email_usuario = $${values.length}`);
        }
        if (params.password_hash !== undefined) {
            values.push(params.password_hash);
            fields.push(`password_hash = $${values.length}`);
        }
        if (fields.length === 0) {
            return this.findById(id_usuario);
        }
        values.push(id_usuario);
        const result = await database_1.pool.query(`
      UPDATE users
      SET
        ${fields.join(', ')},
        updated_at_usuario = NOW()
      WHERE id_usuario = $${values.length}
      RETURNING
        id_usuario,
        nome_usuario,
        email_usuario,
        password_hash,
        id_role,
        created_at_usuario,
        updated_at_usuario
      `, values);
        if (!result.rows[0]) {
            return undefined;
        }
        return this.findById(id_usuario);
    },
    async delete(id_usuario) {
        const result = await database_1.pool.query(`
        DELETE FROM users
        WHERE id_usuario = $1
        `, [id_usuario]);
        return (result.rowCount ?? 0) > 0;
    },
    toPublic(user) {
        return {
            id_usuario: user.id_usuario,
            nome_usuario: user.nome_usuario,
            email_usuario: user.email_usuario,
            role: user.nome_role,
            created_at_usuario: user.created_at_usuario.toISOString(),
            updated_at_usuario: user.updated_at_usuario.toISOString(),
        };
    },
};

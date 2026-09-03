import { pool } from '../db/database';

import type {
  PublicUser,
  UserRecord,
} from '../types/users';

export const UserModel = {
  async create(params: {
    nome_usuario: string;
    email_usuario: string;
    password_hash: string;
  }): Promise<UserRecord> {
    const result =
      await pool.query<UserRecord>(
        `
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
        RETURNING
          id_usuario,
          nome_usuario,
          email_usuario,
          password_hash,
          id_role,
          created_at_usuario,
          updated_at_usuario
        `,
        [
          params.nome_usuario,
          params.email_usuario,
          params.password_hash,
        ]
      );

    return result.rows[0];
  },

async promoteToAdmin(
  id_usuario: string
): Promise<UserRecord | undefined> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verifica se o usuário existe
    const userResult =
      await client.query<UserRecord>(
        `
        SELECT
          id_usuario,
          nome_usuario,
          email_usuario,
          password_hash,
          created_at_usuario,
          updated_at_usuario
        FROM users
        WHERE id_usuario = $1
        `,
        [id_usuario]
      );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return undefined;
    }

    const user = userResult.rows[0];

    // Remove da tabela clients
    await client.query(
      `
      DELETE FROM clients
      WHERE id_usuario = $1
      `,
      [id_usuario]
    );

    // Adiciona na tabela adm
    await client.query(
      `
      INSERT INTO adm (
        id_usuario
      )
      VALUES ($1)
      ON CONFLICT (id_usuario) DO NOTHING
      `,
      [id_usuario]
    );

    await client.query('COMMIT');

    return user;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;

  } finally {
    client.release();
  }
},

  async findById(
    id_usuario: string
  ): Promise<UserRecord | undefined> {
    const result =
      await pool.query<UserRecord>(
        `
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
        `,
        [id_usuario]
      );

    return result.rows[0];
  },

  async findByEmail(
    email_usuario: string
  ): Promise<UserRecord | undefined> {
    const result =
      await pool.query<UserRecord>(
        `
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
        `,
        [email_usuario]
      );

    return result.rows[0];
  },

  async findAll(): Promise<UserRecord[]> {
    const result =
      await pool.query<UserRecord>(
        `
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
        `
      );

    return result.rows;
  },

  async update(
    id_usuario: string,
    params: {
      nome_usuario?: string;
      email_usuario?: string;
      password_hash?: string;
    }
  ): Promise<UserRecord | undefined> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (params.nome_usuario !== undefined) {
      values.push(params.nome_usuario);

      fields.push(
        `nome_usuario = $${values.length}`
      );
    }

    if (params.email_usuario !== undefined) {
      values.push(params.email_usuario);

      fields.push(
        `email_usuario = $${values.length}`
      );
    }

    if (params.password_hash !== undefined) {
      values.push(params.password_hash);

      fields.push(
        `password_hash = $${values.length}`
      );
    }

    if (fields.length === 0) {
      return this.findById(id_usuario);
    }

    values.push(id_usuario);

    const result =
      await pool.query<UserRecord>(
        `
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
        `,
        values
      );

    return result.rows[0];
  },

  async delete(
    id_usuario: string
  ): Promise<boolean> {
    const result =
      await pool.query(
        `
        DELETE FROM users
        WHERE id_usuario = $1
        `,
        [id_usuario]
      );

    return (result.rowCount ?? 0) > 0;
  },

  toPublic(
    user: UserRecord
  ): PublicUser {
    return {
      id_usuario: user.id_usuario,
      nome_usuario: user.nome_usuario,
      email_usuario: user.email_usuario,

      role: user.nome_role,

      created_at_usuario:
        user.created_at_usuario.toISOString(),

      updated_at_usuario:
        user.updated_at_usuario.toISOString(),
    };
  },
};
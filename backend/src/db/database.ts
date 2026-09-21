import { Pool } from 'pg';

import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export async function testDatabaseConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('SELECT 1');

    console.log(
      'PostgreSQL conectado com sucesso.'
    );
  } finally {
    client.release();
  }
}

export async function syncDatabase(): Promise<void> {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS roles (
      id_role UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome_role VARCHAR(20) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS marcas (
      id_marca UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome_marca VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
      id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome_usuario VARCHAR(100),
      email_usuario VARCHAR(255),
      password_hash TEXT,
      id_role UUID,
      created_at_usuario TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at_usuario TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS modelos (
      id_modelo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      id_marca UUID NOT NULL,
      nome_modelo VARCHAR(50),
      ano_modelo INTEGER,
      CONSTRAINT fk_modelo_marca
        FOREIGN KEY (id_marca)
        REFERENCES marcas(id_marca)
        ON DELETE CASCADE
    );

    ALTER TABLE roles
      ADD COLUMN IF NOT EXISTS nome_role VARCHAR(20);

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS nome_usuario VARCHAR(100),
      ADD COLUMN IF NOT EXISTS email_usuario VARCHAR(255),
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS id_role UUID,
      ADD COLUMN IF NOT EXISTS created_at_usuario TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS updated_at_usuario TIMESTAMPTZ;

    ALTER TABLE marcas
      ADD COLUMN IF NOT EXISTS nome_marca VARCHAR(50);

    ALTER TABLE modelos
      ADD COLUMN IF NOT EXISTS id_marca UUID,
      ADD COLUMN IF NOT EXISTS nome_modelo VARCHAR(50),
      ADD COLUMN IF NOT EXISTS ano_modelo INTEGER;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_role'
      ) THEN
        ALTER TABLE users
          ADD CONSTRAINT fk_users_role
          FOREIGN KEY (id_role)
          REFERENCES roles(id_role);
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_modelo_marca'
      ) THEN
        ALTER TABLE modelos
          ADD CONSTRAINT fk_modelo_marca
          FOREIGN KEY (id_marca)
          REFERENCES marcas(id_marca)
          ON DELETE CASCADE;
      END IF;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS unique_roles_nome_role
      ON roles (nome_role);

    CREATE UNIQUE INDEX IF NOT EXISTS unique_users_email_usuario
      ON users (email_usuario);

    CREATE UNIQUE INDEX IF NOT EXISTS unique_marcas_nome_marca
      ON marcas (nome_marca);

    INSERT INTO roles (nome_role)
    SELECT 'adm' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome_role = 'adm');

    INSERT INTO roles (nome_role)
    SELECT 'client' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome_role = 'client');

    INSERT INTO roles (nome_role)
    SELECT 'emp' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome_role = 'emp');

    INSERT INTO users (
      nome_usuario,
      email_usuario,
      password_hash,
      id_role
    )
    SELECT
      'admin',
      'admin@gmail.com',
      crypt('123456', gen_salt('bf')),
      r.id_role
    FROM roles r
    WHERE r.nome_role = 'adm'
      AND NOT EXISTS (
        SELECT 1 FROM users WHERE email_usuario = 'admin@gmail.com'
      );

    INSERT INTO users (
      nome_usuario,
      email_usuario,
      password_hash,
      id_role
    )
    SELECT
      'Guilherme',
      'Gui@gmail.com',
      crypt('123456', gen_salt('bf')),
      r.id_role
    FROM roles r
    WHERE r.nome_role = 'client'
      AND NOT EXISTS (
        SELECT 1 FROM users WHERE email_usuario = 'Gui@gmail.com'
      );

    INSERT INTO marcas (nome_marca)
    SELECT 'Chevrolet'
    WHERE NOT EXISTS (SELECT 1 FROM marcas WHERE nome_marca = 'Chevrolet');

    INSERT INTO marcas (nome_marca)
    SELECT 'Toyota'
    WHERE NOT EXISTS (SELECT 1 FROM marcas WHERE nome_marca = 'Toyota');

    INSERT INTO modelos (id_marca, nome_modelo, ano_modelo)
    SELECT m.id_marca, 'Onix', 2024
    FROM marcas m
    WHERE m.nome_marca = 'Chevrolet'
      AND NOT EXISTS (
        SELECT 1 FROM modelos WHERE nome_modelo = 'Onix' AND ano_modelo = 2024
      );

    INSERT INTO modelos (id_marca, nome_modelo, ano_modelo)
    SELECT m.id_marca, 'Tracker', 2024
    FROM marcas m
    WHERE m.nome_marca = 'Chevrolet'
      AND NOT EXISTS (
        SELECT 1 FROM modelos WHERE nome_modelo = 'Tracker' AND ano_modelo = 2024
      );

    INSERT INTO modelos (id_marca, nome_modelo, ano_modelo)
    SELECT m.id_marca, 'S10', 2025
    FROM marcas m
    WHERE m.nome_marca = 'Chevrolet'
      AND NOT EXISTS (
        SELECT 1 FROM modelos WHERE nome_modelo = 'S10' AND ano_modelo = 2025
      );

    INSERT INTO modelos (id_marca, nome_modelo, ano_modelo)
    SELECT m.id_marca, 'Corolla', 2024
    FROM marcas m
    WHERE m.nome_marca = 'Toyota'
      AND NOT EXISTS (
        SELECT 1 FROM modelos WHERE nome_modelo = 'Corolla' AND ano_modelo = 2024
      );

    INSERT INTO modelos (id_marca, nome_modelo, ano_modelo)
    SELECT m.id_marca, 'Hilux', 2025
    FROM marcas m
    WHERE m.nome_marca = 'Toyota'
      AND NOT EXISTS (
        SELECT 1 FROM modelos WHERE nome_modelo = 'Hilux' AND ano_modelo = 2025
      );

    INSERT INTO modelos (id_marca, nome_modelo, ano_modelo)
    SELECT m.id_marca, 'Yaris', 2024
    FROM marcas m
    WHERE m.nome_marca = 'Toyota'
      AND NOT EXISTS (
        SELECT 1 FROM modelos WHERE nome_modelo = 'Yaris' AND ano_modelo = 2024
      );
  `);

  console.log('Banco sincronizado com sucesso.');
}
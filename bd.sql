-- =========================================================
-- EXTENSÃO
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =========================================================
-- LIMPEZA (opcional)
-- Permite executar o script novamente sem conflitos
-- =========================================================

DROP TABLE IF EXISTS modelos CASCADE;
DROP TABLE IF EXISTS marcas CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;


-- =========================================================
-- ROLES
-- =========================================================

CREATE TABLE roles (
    id_role UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_role VARCHAR(20) NOT NULL UNIQUE
);


INSERT INTO roles (nome_role)
VALUES
    ('adm'),
    ('client'),
    ('emp');


-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_usuario VARCHAR(100) NOT NULL,
    email_usuario VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    id_role UUID NOT NULL,

    created_at_usuario TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at_usuario TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_users_role
        FOREIGN KEY (id_role)
        REFERENCES roles(id_role)
);


-- =========================================================
-- USUÁRIO ADMIN
-- =========================================================

INSERT INTO users (
    nome_usuario,
    email_usuario,
    password_hash,
    id_role
)
VALUES (
    'admin',
    'admin@gmail.com',
    crypt('123456', gen_salt('bf')),
    (
        SELECT id_role
        FROM roles
        WHERE nome_role = 'adm'
    )
);


-- =========================================================
-- USUÁRIO CLIENTE
-- =========================================================

INSERT INTO users (
    nome_usuario,
    email_usuario,
    password_hash,
    id_role
)
VALUES (
    'Guilherme',
    'Gui@gmail.com',
    crypt('123456', gen_salt('bf')),
    (
        SELECT id_role
        FROM roles
        WHERE nome_role = 'client'
    )
);


-- =========================================================
-- CONSULTAR USUÁRIOS
-- =========================================================

SELECT
    u.id_usuario,
    u.nome_usuario,
    u.email_usuario,
    r.nome_role AS role,
    u.created_at_usuario,
    u.updated_at_usuario
FROM users u
INNER JOIN roles r
    ON r.id_role = u.id_role
ORDER BY u.created_at_usuario DESC;


-- =========================================================
-- MARCAS
-- =========================================================

CREATE TABLE marcas (
    id_marca UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_marca VARCHAR(20) NOT NULL UNIQUE
);


-- =========================================================
-- INSERIR MARCAS
-- =========================================================

INSERT INTO marcas (nome_marca)
VALUES
    ('Chevrolet'),
    ('Toyota');


-- =========================================================
-- MODELOS
-- =========================================================

CREATE TABLE modelos (
    id_modelo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_marca UUID NOT NULL,
    nome_modelo VARCHAR(50) NOT NULL,
    ano_modelo INTEGER NOT NULL,

    CONSTRAINT fk_modelo_marca
        FOREIGN KEY (id_marca)
        REFERENCES marcas(id_marca)
        ON DELETE CASCADE
);


-- =========================================================
-- INSERIR MODELOS
-- =========================================================

INSERT INTO modelos (
    id_marca,
    nome_modelo,
    ano_modelo
)
VALUES
(
    (
        SELECT id_marca
        FROM marcas
        WHERE nome_marca = 'Chevrolet'
    ),
    'Onix',
    2024
),
(
    (
        SELECT id_marca
        FROM marcas
        WHERE nome_marca = 'Chevrolet'
    ),
    'Tracker',
    2024
),
(
    (
        SELECT id_marca
        FROM marcas
        WHERE nome_marca = 'Chevrolet'
    ),
    'S10',
    2025
),
(
    (
        SELECT id_marca
        FROM marcas
        WHERE nome_marca = 'Toyota'
    ),
    'Corolla',
    2024
),
(
    (
        SELECT id_marca
        FROM marcas
        WHERE nome_marca = 'Toyota'
    ),
    'Hilux',
    2025
),
(
    (
        SELECT id_marca
        FROM marcas
        WHERE nome_marca = 'Toyota'
    ),
    'Yaris',
    2024
);


-- =========================================================
-- CONSULTAR MARCAS
-- =========================================================

SELECT *
FROM marcas
ORDER BY nome_marca;


-- =========================================================
-- CONSULTAR MODELOS
-- =========================================================

SELECT
    m.id_modelo,
    m.nome_modelo,
    m.ano_modelo,
    ma.nome_marca
FROM modelos m
INNER JOIN marcas ma
    ON ma.id_marca = m.id_marca
ORDER BY ma.nome_marca, m.nome_modelo;

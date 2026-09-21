"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModeloSchema = exports.createModeloSchema = exports.updateMarcaSchema = exports.createMarcaSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    nome_usuario: zod_1.z
        .string()
        .trim()
        .min(2, 'O nome deve ter pelo menos 2 caracteres.')
        .max(100, 'O nome deve ter no máximo 100 caracteres.'),
    email_usuario: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Informe um e-mail válido.'),
    password: zod_1.z
        .string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres.')
        .max(72, 'A senha deve ter no máximo 72 caracteres.'),
});
exports.loginSchema = zod_1.z.object({
    email_usuario: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Informe um e-mail válido.'),
    password: zod_1.z
        .string()
        .min(1, 'A senha é obrigatória.'),
});
exports.updateUserSchema = zod_1.z
    .object({
    nome_usuario: zod_1.z
        .string()
        .trim()
        .min(2, 'O nome deve ter pelo menos 2 caracteres.')
        .max(100, 'O nome deve ter no máximo 100 caracteres.')
        .optional(),
    email_usuario: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Informe um e-mail válido.')
        .optional(),
    currentPassword: zod_1.z
        .string()
        .min(1, 'A senha atual é obrigatória.')
        .optional(),
    newPassword: zod_1.z
        .string()
        .min(6, 'A nova senha deve ter pelo menos 6 caracteres.')
        .max(72, 'A nova senha deve ter no máximo 72 caracteres.')
        .optional(),
})
    .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: 'Informe a senha atual para definir uma nova senha.',
    path: ['currentPassword'],
});
exports.createMarcaSchema = zod_1.z.object({
    nome_marca: zod_1.z
        .string()
        .trim()
        .min(2, 'O nome da marca deve ter pelo menos 2 caracteres.')
        .max(50, 'O nome da marca deve ter no máximo 50 caracteres.'),
});
exports.updateMarcaSchema = zod_1.z.object({
    nome_marca: zod_1.z
        .string()
        .trim()
        .min(2, 'O nome da marca deve ter pelo menos 2 caracteres.')
        .max(50, 'O nome da marca deve ter no máximo 50 caracteres.'),
});
exports.createModeloSchema = zod_1.z.object({
    id_marca: zod_1.z.string().uuid('ID da marca inválido.'),
    nome_modelo: zod_1.z
        .string()
        .trim()
        .min(1, 'O nome do modelo é obrigatório.')
        .max(50, 'O nome do modelo deve ter no máximo 50 caracteres.'),
    ano_modelo: zod_1.z.coerce
        .number()
        .int('Ano deve ser um número inteiro.')
        .min(1900, 'Ano deve ser maior que 1900.')
        .max(2100, 'Ano inválido.'),
});
exports.updateModeloSchema = zod_1.z.object({
    id_marca: zod_1.z.string().uuid('ID da marca inválido.').optional(),
    nome_modelo: zod_1.z
        .string()
        .trim()
        .min(1, 'O nome do modelo é obrigatório.')
        .max(50, 'O nome do modelo deve ter no máximo 50 caracteres.')
        .optional(),
    ano_modelo: zod_1.z.coerce
        .number()
        .int('Ano deve ser um número inteiro.')
        .min(1900, 'Ano deve ser maior que 1900.')
        .max(2100, 'Ano inválido.')
        .optional(),
});

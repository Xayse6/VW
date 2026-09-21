"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModeloSchema = exports.createModeloSchema = exports.updateMarcaSchema = exports.createMarcaSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const validation_1 = require("../messages/validation");
exports.registerSchema = zod_1.z.object({
    nome_usuario: zod_1.z
        .string()
        .trim()
        .min(2, validation_1.VALIDATION_MESSAGES.USER_NAME_MIN)
        .max(100, validation_1.VALIDATION_MESSAGES.USER_NAME_MAX),
    email_usuario: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email(validation_1.VALIDATION_MESSAGES.EMAIL_INVALID),
    password: zod_1.z
        .string()
        .min(6, validation_1.VALIDATION_MESSAGES.PASSWORD_MIN)
        .max(72, validation_1.VALIDATION_MESSAGES.PASSWORD_MAX),
});
exports.loginSchema = zod_1.z.object({
    email_usuario: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email(validation_1.VALIDATION_MESSAGES.EMAIL_INVALID),
    password: zod_1.z
        .string()
        .min(1, validation_1.VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});
exports.updateUserSchema = zod_1.z
    .object({
    nome_usuario: zod_1.z
        .string()
        .trim()
        .min(2, validation_1.VALIDATION_MESSAGES.USER_NAME_MIN)
        .max(100, validation_1.VALIDATION_MESSAGES.USER_NAME_MAX)
        .optional(),
    email_usuario: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email(validation_1.VALIDATION_MESSAGES.EMAIL_INVALID)
        .optional(),
    currentPassword: zod_1.z
        .string()
        .min(1, validation_1.VALIDATION_MESSAGES.CURRENT_PASSWORD_REQUIRED)
        .optional(),
    newPassword: zod_1.z
        .string()
        .min(6, validation_1.VALIDATION_MESSAGES.NEW_PASSWORD_MIN)
        .max(72, validation_1.VALIDATION_MESSAGES.NEW_PASSWORD_MAX)
        .optional(),
})
    .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: validation_1.VALIDATION_MESSAGES.CURRENT_PASSWORD_FOR_NEW,
    path: ['currentPassword'],
});
exports.createMarcaSchema = zod_1.z.object({
    nome_marca: zod_1.z
        .string()
        .trim()
        .min(2, validation_1.VALIDATION_MESSAGES.MARCA_NAME_MIN)
        .max(50, validation_1.VALIDATION_MESSAGES.MARCA_NAME_MAX),
});
exports.updateMarcaSchema = zod_1.z.object({
    nome_marca: zod_1.z
        .string()
        .trim()
        .min(2, validation_1.VALIDATION_MESSAGES.MARCA_NAME_MIN)
        .max(50, validation_1.VALIDATION_MESSAGES.MARCA_NAME_MAX),
});
exports.createModeloSchema = zod_1.z.object({
    id_marca: zod_1.z.string().uuid(validation_1.VALIDATION_MESSAGES.MODELO_ID_INVALID),
    nome_modelo: zod_1.z
        .string()
        .trim()
        .min(1, validation_1.VALIDATION_MESSAGES.MODELO_NAME_REQUIRED)
        .max(50, validation_1.VALIDATION_MESSAGES.MODELO_NAME_MAX),
    ano_modelo: zod_1.z.coerce
        .number()
        .int(validation_1.VALIDATION_MESSAGES.MODELO_YEAR_INT)
        .min(1900, validation_1.VALIDATION_MESSAGES.MODELO_YEAR_MIN)
        .max(2100, validation_1.VALIDATION_MESSAGES.MODELO_YEAR_MAX),
});
exports.updateModeloSchema = zod_1.z.object({
    id_marca: zod_1.z.string().uuid(validation_1.VALIDATION_MESSAGES.MODELO_ID_INVALID).optional(),
    nome_modelo: zod_1.z
        .string()
        .trim()
        .min(1, validation_1.VALIDATION_MESSAGES.MODELO_NAME_REQUIRED)
        .max(50, validation_1.VALIDATION_MESSAGES.MODELO_NAME_MAX)
        .optional(),
    ano_modelo: zod_1.z.coerce
        .number()
        .int(validation_1.VALIDATION_MESSAGES.MODELO_YEAR_INT)
        .min(1900, validation_1.VALIDATION_MESSAGES.MODELO_YEAR_MIN)
        .max(2100, validation_1.VALIDATION_MESSAGES.MODELO_YEAR_MAX)
        .optional(),
});

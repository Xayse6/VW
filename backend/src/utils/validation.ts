import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../messages/validation';

export const registerSchema = z.object({
  nome_usuario: z
    .string()
    .trim()
    .min(2, VALIDATION_MESSAGES.USER_NAME_MIN)
    .max(100, VALIDATION_MESSAGES.USER_NAME_MAX),

  email_usuario: z
    .string()
    .trim()
    .toLowerCase()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),

  password: z
    .string()
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN)
    .max(72, VALIDATION_MESSAGES.PASSWORD_MAX),
});

export const loginSchema = z.object({
  email_usuario: z
    .string()
    .trim()
    .toLowerCase()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),

  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});

export const updateUserSchema = z
  .object({
    nome_usuario: z
      .string()
      .trim()
      .min(2, VALIDATION_MESSAGES.USER_NAME_MIN)
      .max(100, VALIDATION_MESSAGES.USER_NAME_MAX)
      .optional(),

    email_usuario: z
      .string()
      .trim()
      .toLowerCase()
      .email(VALIDATION_MESSAGES.EMAIL_INVALID)
      .optional(),

    currentPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.CURRENT_PASSWORD_REQUIRED)
      .optional(),

    newPassword: z
      .string()
      .min(6, VALIDATION_MESSAGES.NEW_PASSWORD_MIN)
      .max(72, VALIDATION_MESSAGES.NEW_PASSWORD_MAX)
      .optional(),
  })
  .refine(
    (data) =>
      !data.newPassword || !!data.currentPassword,
    {
      message:
        VALIDATION_MESSAGES.CURRENT_PASSWORD_FOR_NEW,
      path: ['currentPassword'],
    }
  );

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;

export const createMarcaSchema = z.object({
  nome_marca: z
    .string()
    .trim()
    .min(2, VALIDATION_MESSAGES.MARCA_NAME_MIN)
    .max(50, VALIDATION_MESSAGES.MARCA_NAME_MAX),
});

export const updateMarcaSchema = z.object({
  nome_marca: z
    .string()
    .trim()
    .min(2, VALIDATION_MESSAGES.MARCA_NAME_MIN)
    .max(50, VALIDATION_MESSAGES.MARCA_NAME_MAX),
});

export const createModeloSchema = z.object({
  id_marca: z.string().uuid(VALIDATION_MESSAGES.MODELO_ID_INVALID),
  nome_modelo: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.MODELO_NAME_REQUIRED)
    .max(50, VALIDATION_MESSAGES.MODELO_NAME_MAX),
  ano_modelo: z.coerce
    .number()
    .int(VALIDATION_MESSAGES.MODELO_YEAR_INT)
    .min(1900, VALIDATION_MESSAGES.MODELO_YEAR_MIN)
    .max(2100, VALIDATION_MESSAGES.MODELO_YEAR_MAX),
});

export const updateModeloSchema = z.object({
  id_marca: z.string().uuid(VALIDATION_MESSAGES.MODELO_ID_INVALID).optional(),
  nome_modelo: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.MODELO_NAME_REQUIRED)
    .max(50, VALIDATION_MESSAGES.MODELO_NAME_MAX)
    .optional(),
  ano_modelo: z.coerce
    .number()
    .int(VALIDATION_MESSAGES.MODELO_YEAR_INT)
    .min(1900, VALIDATION_MESSAGES.MODELO_YEAR_MIN)
    .max(2100, VALIDATION_MESSAGES.MODELO_YEAR_MAX)
    .optional(),
});

export type CreateMarcaInput = z.infer<typeof createMarcaSchema>;
export type UpdateMarcaInput = z.infer<typeof updateMarcaSchema>;
export type CreateModeloInput = z.infer<typeof createModeloSchema>;
export type UpdateModeloInput = z.infer<typeof updateModeloSchema>;

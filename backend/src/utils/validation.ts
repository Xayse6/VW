import { z } from 'zod';

export const registerSchema = z.object({
  nome_usuario: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.'),

  email_usuario: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um e-mail válido.'),

  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .max(72, 'A senha deve ter no máximo 72 caracteres.'),
});

export const loginSchema = z.object({
  email_usuario: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um e-mail válido.'),

  password: z
    .string()
    .min(1, 'A senha é obrigatória.'),
});

export const updateUserSchema = z
  .object({
    nome_usuario: z
      .string()
      .trim()
      .min(2, 'O nome deve ter pelo menos 2 caracteres.')
      .max(100, 'O nome deve ter no máximo 100 caracteres.')
      .optional(),

    email_usuario: z
      .string()
      .trim()
      .toLowerCase()
      .email('Informe um e-mail válido.')
      .optional(),

    currentPassword: z
      .string()
      .min(1, 'A senha atual é obrigatória.')
      .optional(),

    newPassword: z
      .string()
      .min(6, 'A nova senha deve ter pelo menos 6 caracteres.')
      .max(72, 'A nova senha deve ter no máximo 72 caracteres.')
      .optional(),
  })
  .refine(
    (data) =>
      !data.newPassword || !!data.currentPassword,
    {
      message:
        'Informe a senha atual para definir uma nova senha.',
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
    .min(2, 'O nome da marca deve ter pelo menos 2 caracteres.')
    .max(50, 'O nome da marca deve ter no máximo 50 caracteres.'),
});

export const updateMarcaSchema = z.object({
  nome_marca: z
    .string()
    .trim()
    .min(2, 'O nome da marca deve ter pelo menos 2 caracteres.')
    .max(50, 'O nome da marca deve ter no máximo 50 caracteres.'),
});

export const createModeloSchema = z.object({
  id_marca: z.string().uuid('ID da marca inválido.'),
  nome_modelo: z
    .string()
    .trim()
    .min(1, 'O nome do modelo é obrigatório.')
    .max(50, 'O nome do modelo deve ter no máximo 50 caracteres.'),
  ano_modelo: z.coerce
    .number()
    .int('Ano deve ser um número inteiro.')
    .min(1900, 'Ano deve ser maior que 1900.')
    .max(2100, 'Ano inválido.'),
});

export const updateModeloSchema = z.object({
  id_marca: z.string().uuid('ID da marca inválido.').optional(),
  nome_modelo: z
    .string()
    .trim()
    .min(1, 'O nome do modelo é obrigatório.')
    .max(50, 'O nome do modelo deve ter no máximo 50 caracteres.')
    .optional(),
  ano_modelo: z.coerce
    .number()
    .int('Ano deve ser um número inteiro.')
    .min(1900, 'Ano deve ser maior que 1900.')
    .max(2100, 'Ano inválido.')
    .optional(),
});

export type CreateMarcaInput = z.infer<typeof createMarcaSchema>;
export type UpdateMarcaInput = z.infer<typeof updateMarcaSchema>;
export type CreateModeloInput = z.infer<typeof createModeloSchema>;
export type UpdateModeloInput = z.infer<typeof updateModeloSchema>;

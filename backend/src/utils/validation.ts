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
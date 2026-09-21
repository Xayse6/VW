import type { Request, Response } from 'express';

import { AUTH_ERRORS } from '../messages/auth';
import { SUCCESS_MESSAGES } from '../messages/success';
import { UserModel } from '../model/User';
import { AppError } from '../utils/AppError';

import {
  comparePassword,
  hashPassword,
} from '../utils/password';

import { signToken } from '../utils/jwt';

import {
  loginSchema,
  registerSchema,
} from '../utils/validation';

export const AuthController = {
  async register(
    req: Request,
    res: Response
  ): Promise<void> {
    const data = registerSchema.parse(req.body);

    const existing =
      await UserModel.findByEmail(
        data.email_usuario
      );

    if (existing) {
      throw new AppError(
        AUTH_ERRORS.EMAIL_ALREADY_REGISTERED,
        409
      );
    }

    const password_hash =
      await hashPassword(data.password);

    const user = await UserModel.create({
      nome_usuario: data.nome_usuario,
      email_usuario: data.email_usuario,
      password_hash,
    });

    const token = signToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    res.status(201).json({
      message: SUCCESS_MESSAGES.USER_REGISTERED,
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_usuario: user.email_usuario,
        role: user.nome_role ?? 'client',
        created_at_usuario:
          user.created_at_usuario,
        updated_at_usuario:
          user.updated_at_usuario,
      },
      token,
    });
  },

  async login(
    req: Request,
    res: Response
  ): Promise<void> {
    const data = loginSchema.parse(req.body);

    const user =
      await UserModel.findByEmail(
        data.email_usuario
      );

    if (!user) {
      throw new AppError(
        AUTH_ERRORS.INVALID_CREDENTIALS,
        401
      );
    }

    const isPasswordValid =
      await comparePassword(
        data.password,
        user.password_hash
      );

    if (!isPasswordValid) {
      throw new AppError(
        AUTH_ERRORS.INVALID_CREDENTIALS,
        401
      );
    }

    const token = signToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    res.status(200).json({
      message: SUCCESS_MESSAGES.USER_LOGIN,
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_usuario: user.email_usuario,
        role: user.nome_role ?? 'client',
        created_at_usuario:
          user.created_at_usuario,
        updated_at_usuario:
          user.updated_at_usuario,
      },
      token,
    });
  },

  async me(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user?.sub;

    if (!userId) {
      throw new AppError(
        AUTH_ERRORS.USER_NOT_AUTHENTICATED,
        401
      );
    }

    const user =
      await UserModel.findById(userId);

    if (!user) {
      throw new AppError(
        'Usuario nao encontrado.',
        404
      );
    }

    res.status(200).json({
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_usuario: user.email_usuario,
        role: user.nome_role ?? 'client',
        created_at_usuario:
          user.created_at_usuario,
        updated_at_usuario:
          user.updated_at_usuario,
      },
    });
  },
  async all(
    _req: Request,
    res: Response
  ): Promise<void> {
    const users = await UserModel.findAll();

    res.status(200).json({
      users: users.map(UserModel.toPublic),
    });
  },
};
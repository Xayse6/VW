import type { Request, Response } from 'express';

import { env } from '../config/env';
import { AUTH_ERRORS } from '../messages/auth';
import { SUCCESS_MESSAGES } from '../messages/success';
import { UserModel } from '../model/User';
import { AppError } from '../utils/AppError';

import {
  comparePassword,
  hashPassword,
} from '../utils/password';

import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt';

import {
  loginSchema,
  registerSchema,
} from '../utils/validation';

function setAuthCookies(res: Response, refreshToken: string): void {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    secure: env.nodeEnv === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

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

    const token = signAccessToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    const refreshToken = signRefreshToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    setAuthCookies(res, refreshToken);

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

    const token = signAccessToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    const refreshToken = signRefreshToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    setAuthCookies(res, refreshToken);

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

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new AppError(AUTH_ERRORS.INVALID_SESSION, 401);
    }

    const payload = verifyToken(refreshToken, 'refresh');
    const user = await UserModel.findById(payload.sub);

    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_AUTHENTICATED, 401);
    }

    const newAccessToken = signAccessToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    const nextRefreshToken = signRefreshToken({
      sub: user.id_usuario,
      email: user.email_usuario,
      role: user.nome_role ?? 'client',
    });

    setAuthCookies(res, nextRefreshToken);

    res.status(200).json({
      message: 'Sessão renovada com sucesso.',
      token: newAccessToken,
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_usuario: user.email_usuario,
        role: user.nome_role ?? 'client',
        created_at_usuario: user.created_at_usuario,
        updated_at_usuario: user.updated_at_usuario,
      },
    });
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refresh_token', { path: '/' });
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
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
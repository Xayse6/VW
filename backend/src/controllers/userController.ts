import type {
  Request,
  Response,
} from 'express';

import { UserModel } from '../model/User';
import { AppError } from '../utils/AppError';

import {
  comparePassword,
  hashPassword,
} from '../utils/password';

import {
  updateUserSchema,
} from '../utils/validation';

export const UserController = {
  async list(
  _req: Request,
  res: Response
): Promise<void> {
  const users =
    await UserModel.findAll();

  res.status(200).json({
    users: users.map(
      UserModel.toPublic
    ),
  });
  },
  async getById(
    req: Request,
    res: Response
  ): Promise<void> {
    const id_usuario = req.params.id;

    if (typeof id_usuario !== 'string') {
      throw new AppError(
        'ID do usuario invalido.',
        400
      );
    }

    const user =
      await UserModel.findById(
        id_usuario
      );

    if (!user) {
      throw new AppError(
        'Usuario nao encontrado.',
        404
      );
    }

    res.status(200).json({
      user:
        UserModel.toPublic(user),
    });
  },

  async promoteToAdmin(
    req: Request,
    res: Response
  ): Promise<void> {
    const id_usuario = req.params.id;

    if (typeof id_usuario !== 'string') {
      throw new AppError(
        'ID do usuario invalido.',
        400
      );
    }

    const user =
      await UserModel.promoteToAdmin(id_usuario);

    if (!user) {
      throw new AppError(
        'Usuario nao encontrado.',
        404
      );
    }

    res.status(200).json({
      message:
        'Usuario promovido para administrador.',
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_usuario: user.email_usuario,
      },
    });
  },

  async update(
    req: Request,
    res: Response
  ): Promise<void> {
    const id_usuario = req.params.id;

    if (typeof id_usuario !== 'string') {
      throw new AppError(
        'ID do usuario invalido.',
        400
      );
    }

    const data =
      updateUserSchema.parse(
        req.body
      );

    const user =
      await UserModel.findById(
        id_usuario
      );

    if (!user) {
      throw new AppError(
        'Usuario nao encontrado.',
        404
      );
    }

    if (
      data.email_usuario &&
      data.email_usuario !==
        user.email_usuario
    ) {
      const emailInUse =
        await UserModel.findByEmail(
          data.email_usuario
        );

      if (
        emailInUse &&
        emailInUse.id_usuario !==
          user.id_usuario
      ) {
        throw new AppError(
          'Este e-mail ja esta em uso por outro usuario.',
          409
        );
      }
    }

    let password_hash:
      | string
      | undefined;

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new AppError(
          'A senha atual e obrigatoria.',
          400
        );
      }

      const isCurrentValid =
        await comparePassword(
          data.currentPassword,
          user.password_hash
        );

      if (!isCurrentValid) {
        throw new AppError(
          'Senha atual incorreta.',
          401
        );
      }

      password_hash =
        await hashPassword(
          data.newPassword
        );
    }

    const updated =
      await UserModel.update(
        id_usuario,
        {
          nome_usuario:
            data.nome_usuario,

          email_usuario:
            data.email_usuario,

          password_hash,
        }
      );

    if (!updated) {
      throw new AppError(
        'Nao foi possivel atualizar o usuario.',
        500
      );
    }

    res.status(200).json({
      message:
        'Dados atualizados com sucesso.',

      user:
        UserModel.toPublic(updated),
    });
  },

  async remove(
    req: Request,
    res: Response
  ): Promise<void> {
    const id_usuario = req.params.id;

    if (typeof id_usuario !== 'string') {
      throw new AppError(
        'ID do usuario invalido.',
        400
      );
    }

    const deleted =
      await UserModel.delete(
        id_usuario
      );

    if (!deleted) {
      throw new AppError(
        'Usuario nao encontrado.',
        404
      );
    }

    res.status(200).json({
      message:
        'Conta removida com sucesso.',
    });
  },
};
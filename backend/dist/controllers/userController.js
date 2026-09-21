"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const success_1 = require("../messages/success");
const user_1 = require("../messages/user");
const User_1 = require("../model/User");
const AppError_1 = require("../utils/AppError");
const password_1 = require("../utils/password");
const validation_1 = require("../utils/validation");
exports.UserController = {
    async list(_req, res) {
        const users = await User_1.UserModel.findAll();
        res.status(200).json({
            users: users.map(User_1.UserModel.toPublic),
        });
    },
    async getById(req, res) {
        const id_usuario = req.params.id;
        if (typeof id_usuario !== 'string') {
            throw new AppError_1.AppError(user_1.USER_ERRORS.INVALID_ID, 400);
        }
        const user = await User_1.UserModel.findById(id_usuario);
        if (!user) {
            throw new AppError_1.AppError(user_1.USER_ERRORS.NOT_FOUND, 404);
        }
        res.status(200).json({
            user: User_1.UserModel.toPublic(user),
        });
    },
    async promoteToAdmin(req, res) {
        const id_usuario = req.params.id;
        if (typeof id_usuario !== 'string') {
            throw new AppError_1.AppError(user_1.USER_ERRORS.INVALID_ID, 400);
        }
        const user = await User_1.UserModel.promoteToAdmin(id_usuario);
        if (!user) {
            throw new AppError_1.AppError(user_1.USER_ERRORS.NOT_FOUND, 404);
        }
        res.status(200).json({
            message: success_1.SUCCESS_MESSAGES.USER_PROMOTED,
            user: {
                id_usuario: user.id_usuario,
                nome_usuario: user.nome_usuario,
                email_usuario: user.email_usuario,
            },
        });
    },
    async update(req, res) {
        const id_usuario = req.params.id;
        if (typeof id_usuario !== 'string') {
            throw new AppError_1.AppError(user_1.USER_ERRORS.INVALID_ID, 400);
        }
        const data = validation_1.updateUserSchema.parse(req.body);
        const user = await User_1.UserModel.findById(id_usuario);
        if (!user) {
            throw new AppError_1.AppError(user_1.USER_ERRORS.NOT_FOUND, 404);
        }
        if (data.email_usuario &&
            data.email_usuario !==
                user.email_usuario) {
            const emailInUse = await User_1.UserModel.findByEmail(data.email_usuario);
            if (emailInUse &&
                emailInUse.id_usuario !==
                    user.id_usuario) {
                throw new AppError_1.AppError(user_1.USER_ERRORS.EMAIL_IN_USE, 409);
            }
        }
        let password_hash;
        if (data.newPassword) {
            if (!data.currentPassword) {
                throw new AppError_1.AppError('A senha atual e obrigatoria.', 400);
            }
            const isCurrentValid = await (0, password_1.comparePassword)(data.currentPassword, user.password_hash);
            if (!isCurrentValid) {
                throw new AppError_1.AppError('Senha atual incorreta.', 401);
            }
            password_hash =
                await (0, password_1.hashPassword)(data.newPassword);
        }
        const updated = await User_1.UserModel.update(id_usuario, {
            nome_usuario: data.nome_usuario,
            email_usuario: data.email_usuario,
            password_hash,
        });
        if (!updated) {
            throw new AppError_1.AppError(user_1.USER_ERRORS.UPDATE_FAILED, 500);
        }
        res.status(200).json({
            message: success_1.SUCCESS_MESSAGES.USER_UPDATED,
            user: User_1.UserModel.toPublic(updated),
        });
    },
    async remove(req, res) {
        const id_usuario = req.params.id;
        if (typeof id_usuario !== 'string') {
            throw new AppError_1.AppError(user_1.USER_ERRORS.INVALID_ID, 400);
        }
        const deleted = await User_1.UserModel.delete(id_usuario);
        if (!deleted) {
            throw new AppError_1.AppError(user_1.USER_ERRORS.DELETE_FAILED, 404);
        }
        res.status(200).json({
            message: success_1.SUCCESS_MESSAGES.USER_REMOVED,
        });
    },
};

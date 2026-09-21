"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_1 = require("../messages/auth");
const success_1 = require("../messages/success");
const User_1 = require("../model/User");
const AppError_1 = require("../utils/AppError");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
exports.AuthController = {
    async register(req, res) {
        const data = validation_1.registerSchema.parse(req.body);
        const existing = await User_1.UserModel.findByEmail(data.email_usuario);
        if (existing) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.EMAIL_ALREADY_REGISTERED, 409);
        }
        const password_hash = await (0, password_1.hashPassword)(data.password);
        const user = await User_1.UserModel.create({
            nome_usuario: data.nome_usuario,
            email_usuario: data.email_usuario,
            password_hash,
        });
        const token = (0, jwt_1.signToken)({
            sub: user.id_usuario,
            email: user.email_usuario,
            role: user.nome_role ?? 'client',
        });
        res.status(201).json({
            message: success_1.SUCCESS_MESSAGES.USER_REGISTERED,
            user: {
                id_usuario: user.id_usuario,
                nome_usuario: user.nome_usuario,
                email_usuario: user.email_usuario,
                role: user.nome_role ?? 'client',
                created_at_usuario: user.created_at_usuario,
                updated_at_usuario: user.updated_at_usuario,
            },
            token,
        });
    },
    async login(req, res) {
        const data = validation_1.loginSchema.parse(req.body);
        const user = await User_1.UserModel.findByEmail(data.email_usuario);
        if (!user) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.INVALID_CREDENTIALS, 401);
        }
        const isPasswordValid = await (0, password_1.comparePassword)(data.password, user.password_hash);
        if (!isPasswordValid) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.INVALID_CREDENTIALS, 401);
        }
        const token = (0, jwt_1.signToken)({
            sub: user.id_usuario,
            email: user.email_usuario,
            role: user.nome_role ?? 'client',
        });
        res.status(200).json({
            message: success_1.SUCCESS_MESSAGES.USER_LOGIN,
            user: {
                id_usuario: user.id_usuario,
                nome_usuario: user.nome_usuario,
                email_usuario: user.email_usuario,
                role: user.nome_role ?? 'client',
                created_at_usuario: user.created_at_usuario,
                updated_at_usuario: user.updated_at_usuario,
            },
            token,
        });
    },
    async me(req, res) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new AppError_1.AppError(auth_1.AUTH_ERRORS.USER_NOT_AUTHENTICATED, 401);
        }
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            throw new AppError_1.AppError('Usuario nao encontrado.', 404);
        }
        res.status(200).json({
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
    async all(_req, res) {
        const users = await User_1.UserModel.findAll();
        res.status(200).json({
            users: users.map(User_1.UserModel.toPublic),
        });
    },
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const marcaRoutes_1 = __importDefault(require("./routes/marcaRoutes"));
const modeloRoutes_1 = __importDefault(require("./routes/modeloRoutes"));
function createApp() {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
    }));
    app.use((0, cookie_parser_1.default)());
    const allowedOrigins = Array.isArray(env_1.env.corsOrigin)
        ? env_1.env.corsOrigin
        : [env_1.env.corsOrigin];
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            if (!origin ||
                allowedOrigins.includes(origin) ||
                (env_1.env.nodeEnv === 'development' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))) {
                callback(null, true);
                return;
            }
            callback(new Error('Origem não permitida pelo CORS.'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204,
    }));
    app.use(express_1.default.json({
        limit: '1mb',
    }));
    app.use('/api/auth', (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            code: 'TOO_MANY_REQUESTS',
            message: 'Muitas tentativas de autenticação. Tente novamente mais tarde.',
        },
    }));
    app.get('/api/health', (_req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    });
    app.use('/api/auth', authRoutes_1.default);
    app.use('/api/users', userRoutes_1.default);
    app.use('/api/marcas', marcaRoutes_1.default);
    app.use('/api/modelos', modeloRoutes_1.default);
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}

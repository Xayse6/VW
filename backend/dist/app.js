"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const marcaRoutes_1 = __importDefault(require("./routes/marcaRoutes"));
const modeloRoutes_1 = __importDefault(require("./routes/modeloRoutes"));
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env_1.env.corsOrigin,
        credentials: true,
    }));
    app.use(express_1.default.json({
        limit: '1mb',
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

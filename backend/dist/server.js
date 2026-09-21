"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./db/database");
async function startServer() {
    try {
        await (0, database_1.testDatabaseConnection)();
        await (0, database_1.syncDatabase)();
        const app = (0, app_1.createApp)();
        app.listen(env_1.env.port, env_1.env.host, () => {
            console.log(`API rodando em http://${env_1.env.host}:${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error('Falha ao iniciar servidor:', error);
        process.exit(1);
    }
}
void startServer();

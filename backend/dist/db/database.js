"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
const pg_1 = require("pg");
const env_1 = require("../config/env");
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.databaseUrl,
});
async function testDatabaseConnection() {
    const client = await exports.pool.connect();
    try {
        await client.query('SELECT 1');
        console.log('PostgreSQL conectado com sucesso.');
    }
    finally {
        client.release();
    }
}

import { createApp } from './app';
import { env } from './config/env';
import { syncDatabase, testDatabaseConnection } from './db/database';

async function startServer(): Promise<void> {
  try {
    await testDatabaseConnection();
    await syncDatabase();

    const app = createApp();

    app.listen(env.port, env.host, () => {
      console.log(
        `API rodando em http://${env.host}:${env.port}`
      );
    });
  } catch (error) {
    console.error(
      'Falha ao iniciar servidor:',
      error
    );

    process.exit(1);
  }
}

void startServer();
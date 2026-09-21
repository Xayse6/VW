import { createApp } from './app';
import { env } from './config/env';
import { syncDatabase, testDatabaseConnection } from './db/database';

async function startServer(): Promise<void> {
  try {
    await testDatabaseConnection();
    await syncDatabase();

    const app = createApp();

    app.listen(env.port, () => {
      console.log(
        `API rodando em http://localhost:${env.port}`
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
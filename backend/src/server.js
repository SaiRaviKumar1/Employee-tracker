import mongoose from 'mongoose';
import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { env } from './config/env.js';

let server;
let shuttingDown = false;

async function startServer() {
  await connectToDatabase(env.mongoUri);

  server = app.listen(env.port, () => {
    console.log(`API server running on http://localhost:${env.port}`);
  });
}

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`${signal} received. Closing server gracefully...`);

  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  await mongoose.connection.close();
}

process.on('SIGINT', async () => {
  try {
    await shutdown('SIGINT');
    process.exit(0);
  } catch (error) {
    console.error('Shutdown failed:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await shutdown('SIGTERM');
    process.exit(0);
  } catch (error) {
    console.error('Shutdown failed:', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled promise rejection:', reason);

  try {
    await shutdown('unhandledRejection');
  } finally {
    process.exit(1);
  }
});

startServer().catch((error) => {
  console.error('Unable to start the API server:', error);
  process.exit(1);
});

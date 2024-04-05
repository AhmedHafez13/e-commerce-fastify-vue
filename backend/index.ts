import { config } from 'dotenv';
import Server from './src/server';
import writeDotEnv from './scripts/write-dotenv';

// Load `.env` constants
config();

// Write `.env` file for backend
// Prisma expects to find the database connection string in this file
writeDotEnv();

// Get port and host from `.env`
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST_NAME || '0.0.0.0';

// Application global options
const options = {
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'h:MM:ss TT',
        ignore:
          'pid,reqId,hostname,req.hostname,req.remotePort,req.remoteAddress',
      },
    },
  },
};

new Server(options).start(port, host).catch((error) => {
  // TODO: APPLY A PROBER ERROR HANDLING
  console.error({ error });
  process.exit(1);
});

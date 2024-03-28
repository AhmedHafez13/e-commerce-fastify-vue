import { config } from 'dotenv';
import Fastify from 'fastify';

config();

const fastify = Fastify({
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
});

// Declare a route
fastify.get('/', function (_request, reply) {
  reply.send({ hello: 'world' });
});

console.log({ env: process.env.PORT });

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST_NAME || '0.0.0.0';

// Run the server!
fastify.listen({ port, host }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});

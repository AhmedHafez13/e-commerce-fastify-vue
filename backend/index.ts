import Fastify from 'fastify';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'h:MM:ss TT',
        ignore: 'pid,reqId,hostname,req.hostname,req.remotePort,req.remoteAddress',
      },
    },
  },
});

// Declare a route
fastify.get('/', function (_request, reply) {
  reply.send({ hello: 'world' });
});

// Run the server!
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});

import { FastifyReply, FastifyRequest } from 'fastify';

class DummyController {
  async dummyHandler(_request: FastifyRequest, reply: FastifyReply) {
    reply.send({ hello: 'from DummyController.dummyHandler' });
  }
}

export default DummyController;

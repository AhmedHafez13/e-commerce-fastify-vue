import AuthHook from '@app/hooks/auth.hook';
import { FastifyInstance } from 'fastify';
import DummyController from './dummy.controller';
import BaseAppPlugin from '../base.plugins';

class Dummy extends BaseAppPlugin {
  private dummyController;

  constructor(protected override app: FastifyInstance) {
    super(app);
    this.dummyController = new DummyController();
  }

  async handler(): Promise<void> {
    this.app.register(async (app) => {
      app.addHook('onRequest', new AuthHook(app).handler);

      app.get('/dummy-error', async (_request, reply) => {
        throw new Error('Dummy Error');
        reply.send({ hello: 'dummy' });
      });
    });

    this.app.get('/', async (_request, reply) => {
      reply.send({ hello: 'world' });
    });

    this.app.get('/dummy-handler', this.dummyController.dummyHandler);
  }
}

export default Dummy;

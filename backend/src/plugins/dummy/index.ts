import AuthHook from '@app/hooks/auth.hook';
import { FastifyInstance } from 'fastify';
import DummyController from './dummy.controller';
import BaseAppPlugin from '../base.plugins';

class Dummy extends BaseAppPlugin {
  override basePath: string = 'dummy';
  private dummyController;

  constructor() {
    super();
    this.dummyController = new DummyController();
  }

  async handler(app: FastifyInstance): Promise<void> {
    app.register(async (app) => {
      app.addHook('onRequest', new AuthHook(app).handler);

      app.get('/dummy-error', async (_request, reply) => {
        throw new Error('Dummy Error');
        reply.send({ hello: 'dummy' });
      });
    });

    app.get('/', async (_request, reply) => {
      reply.send({ hello: 'world' });
    });

    app.get('/dummy-handler', this.dummyController.dummyHandler);
  }
}

export default Dummy;

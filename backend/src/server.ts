import fastify, { FastifyInstance } from 'fastify';
import AppPlugins from './plugins/app.plugins';

export default class Server {
  private app: FastifyInstance;

  constructor(options = {}) {
    this.app = fastify(options);
  }

  public async start(port: number, host: string): Promise<void> {
    this.setupAppHooks();
    this.setupErrorHooks();
    this.registerAppPlugins();

    this.app.listen({ port, host }, (err, address) => {
      if (err) {
        this.app.log.error(err);
        process.exit(1);
      }
      console.log(`Server is now listening on ${address}`);
    });
  }

  private setupAppHooks() {
    // TODO HANDLE AUTHENTICATION HOOK
    // this.app.addHook('onRequest', new AuthHook(this.app).handler);
  }

  setupErrorHooks() {
    this.app.addHook('onError', (_request, _reply, error, done) => {
      // TODO: APPLY A PROBER ERROR HANDLING
      console.error({ error });
      done();
    });
  }

  registerAppPlugins() {
    for (const AppPlugin of AppPlugins) {
      this.app.register(async (instance, options, done) =>
        new AppPlugin(instance, options, done).handler()
      );
    }
  }
}

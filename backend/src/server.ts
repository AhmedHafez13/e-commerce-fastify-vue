import fastify, { FastifyInstance } from 'fastify';
import APIPlugins from './plugins/app.plugins';

/**
 * The main server class that manages Fastify application initialization, configuration, plugin registration, and startup.
 */
export default class Server {
  private app: FastifyInstance;

  /**
   * Creates a new Server instance.
   *
   * @param options (object, optional) - Configuration options to be passed to the Fastify instance during initialization.
   */
  constructor(options = {}) {
    this.app = fastify(options);
  }

  /**
   * Starts the server by listening on a specified port and host.
   *
   * @param port (number) - The port number on which the server will listen for incoming requests.
   * @param host (string) - The hostname or IP address on which the server will listen.
   * @returns {Promise<void>} A Promise that resolves when the server is successfully listening.
   */
  public async start(port: number, host: string): Promise<void> {
    this.setupAppHooks();
    this.setupErrorHooks();
    this.registerAPIPlugins();

    this.app.listen({ port, host }, (err, address) => {
      if (err) {
        this.app.log.error(err);
        process.exit(1);
      }
      console.log(`Server is now listening on ${address}`);
    });
  }

  /**
   * Sets up custom hooks for the Fastify application (e.g., request/response lifecycle hooks, global error handling).
   */
  private setupAppHooks() {
    // TODO HANDLE AUTHENTICATION HOOK
    // this.app.addHook('onRequest', new AuthHook(this.app).handler);
  }

  /**
   * Configures error handling mechanisms for the application (e.g., custom error handlers, logging).
   */
  private setupErrorHooks() {
    this.app.addHook('onError', (_request, _reply, error, done) => {
      // TODO: APPLY A PROBER ERROR HANDLING
      console.error({ error });
      done();
    });
  }

  /**
   * Registers application plugins with the Fastify instance.
   */
  private registerAPIPlugins() {
    for (const APIPlugin of APIPlugins) {
      const plugin = new APIPlugin();
      this.app.register(
        async (...args) => {
          plugin.handler(...args);
        },
        {
          prefix: plugin.basePath,
        }
      );
    }
  }
}

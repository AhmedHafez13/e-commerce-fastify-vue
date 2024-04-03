import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export interface APIPlugin {
  basePath: string;
  handler(
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ): Promise<void>;
}

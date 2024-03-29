import { AppPlugin } from '@app/types/app.types';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

abstract class BaseAppPlugin implements AppPlugin {
  constructor(
    protected app: FastifyInstance,
    protected options?: FastifyPluginOptions,
    protected done?: (err?: Error | undefined) => void
  ) {}

  abstract handler(): Promise<void>;
}

export default BaseAppPlugin;

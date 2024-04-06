import { APIPlugin } from '../types/app.types';
import { FastifyInstance } from 'fastify';

abstract class BaseAppPlugin implements APIPlugin {
  abstract basePath: string;

  constructor() {}

  abstract handler(app: FastifyInstance): Promise<void>;
}

export default BaseAppPlugin;

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import Dummy from './dummy';
import { AppPlugin } from '@app/types/app.types';

// Register App Plugins
const AppPlugins: (new (
  instance: FastifyInstance,
  options?: FastifyPluginOptions,
  done?: (err?: Error | undefined) => void
) => AppPlugin)[] = [
  Dummy,
  // REGISTER NEW MORE PLUGINS HERE!
];

export default AppPlugins;

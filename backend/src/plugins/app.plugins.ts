import Dummy from './dummy';
import { APIPlugin } from '@app/types/app.types';

// Register App Plugins
const APIPlugins: (new () => APIPlugin)[] = [
  Dummy,
  // REGISTER NEW MORE PLUGINS HERE!
];

export default APIPlugins;

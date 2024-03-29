import { APIPlugin } from '@app/types/app.types';
import CategoryPlugin from './category';

// Register App Plugins
const APIPlugins: (new () => APIPlugin)[] = [
  CategoryPlugin,
  // REGISTER NEW MORE PLUGINS HERE!
];

export default APIPlugins;

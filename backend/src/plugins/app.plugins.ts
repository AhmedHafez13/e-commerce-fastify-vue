import { APIPlugin } from '@app/types/app.types';
import CategoryPlugin from './category';
import ProductPlugin from './product';

// Register App Plugins
const APIPlugins: (new () => APIPlugin)[] = [
  CategoryPlugin,
  ProductPlugin,
  // REGISTER NEW MORE PLUGINS HERE!
];

export default APIPlugins;

import { APIPlugin } from '../types/app.types';
import CategoryPlugin from './category';
import ProductPlugin from './product';
import ImageUpload from './image-center';

// Register App Plugins
const APIPlugins: (new () => APIPlugin)[] = [
  CategoryPlugin,
  ProductPlugin,
  ImageUpload,
  // REGISTER NEW MORE PLUGINS HERE!
];

export default APIPlugins;

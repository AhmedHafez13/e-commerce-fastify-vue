import { FastifyInstance } from 'fastify';
import BaseAppPlugin from '../base.plugins';
import ImageCenterController from './image-center.controller';
import fastifyMultipart from '@fastify/multipart';

export default class ImageUpload extends BaseAppPlugin {
  override basePath: string = 'image/upload';
  private imageCenterController;

  constructor() {
    super();
    this.imageCenterController = new ImageCenterController();
  }

  override async handler(app: FastifyInstance): Promise<void> {
    // Register plugins
    app.register(fastifyMultipart, {
      limits: {
        fileSize: 4 * 1024 * 1024, // Max file size in bytes
        files: 1, // Max number of file fields
      },
    });

    // Routes
    app.post('/', this.imageCenterController.uploadImage);
  }
}

import fs from 'fs';
import path from 'path';
import util from 'util';
import { FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'stream';
import appSetting from '../../settings/app.setting';
import ImageUtils from '../../utils/image.utils';

const pump = util.promisify(pipeline);

export default class ImageCenterController {
  /**
   * Upload a new image.
   *
   * @param request - Fastify request object containing the image file
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async uploadImage(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parts = request.files();
    const randomName = Math.random().toString(36).substring(2, 9);
    const filename = `${Date.now()}-${randomName}`;
    const tempFilePath = path.join(appSetting.tempImagesPath, filename);
    let hasFiles = false;

    // Create output directories
    fs.mkdirSync(appSetting.tempImagesPath, { recursive: true });
    fs.mkdirSync(appSetting.internalImagesPath, { recursive: true });

    for await (const part of parts) {
      hasFiles = true;

      // Check mimetype
      const ext = part.mimetype.split('image/').pop();
      if (!ext || !appSetting.allowedImageExts.includes(ext.toLowerCase())) {
        const allowed = appSetting.allowedImageExts.join(', ');
        return reply
          .code(422)
          .send({ message: `Image type not allowed. Allowed: ${allowed}` });
      }

      await pump(part.file, fs.createWriteStream(tempFilePath));
    }

    if (!hasFiles) {
      return reply.code(400).send({ message: 'Image is required' });
    }

    // Resize image
    const outputFilename = await ImageUtils.resizeImage(
      tempFilePath,
      appSetting.internalImagesPath,
      filename
    );

    // Clean up
    try {
      ImageUtils.deleteFile(tempFilePath);
    } catch (error) {
      // TODO: APPLY PROPER ERROR HANDLING
      console.error(error);
    }

    if (!outputFilename) {
      return reply.code(422).send({ message: 'Error while processing image' });
    }

    reply
      .code(201)
      .send({ data: path.join(appSetting.publicImagesPath, outputFilename) });
  }
}

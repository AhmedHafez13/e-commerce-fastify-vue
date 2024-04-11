import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Utility class for image manipulation tasks.
 */
export default class ImageUtils {
  /**
   * Resizes an image and applies a blur effect, saving the result as a WebP file.
   *
   * @param fullImagePath The full path to the original image file.
   * @param outputDirPath The directory path where the resized image will be saved.
   * @param filename The desired filename for the resized image (without extension).
   * @param options (Optional) An object containing options for the resize and blur operations.
   *                 Defaults to { blur: 26, quality: 70 }.
   *                 - `blur`: The amount of blur to apply (integer).
   *                 - `quality`: The WebP image quality (0-100).
   * @returns A promise that resolves to the filename of the resized image if successful, or null on error.
   */
  static async resizeImage(
    fullImagePath: string,
    outputDirPath: string,
    filename: string,
    options = { blur: 26, quality: 70 }
  ): Promise<string | null> {
    const file = fs.readFileSync(fullImagePath);
    const image = sharp(file.buffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) return null;

    const size = Math.max(width, height);
    const resizeOptions = width > height ? { width: size } : { hight: size };
    const outputFilename = `${filename}.webp`;
    const outputFilePath = path.join(outputDirPath, outputFilename);

    try {
      const sharpOriginal = sharp(fullImagePath);
      const resizedBuffer = await sharpOriginal
        .resize(resizeOptions)
        .toBuffer();
      await sharpOriginal
        .resize(size, size, { fit: 'cover' })
        .blur(options.blur)
        .composite([{ input: resizedBuffer, gravity: 'center' }])
        .webp({ quality: options.quality })
        .toFile(outputFilePath);
      return outputFilename;
    } catch (error) {
      // TODO: APPLY PROPER ERROR HANDLING
      return null;
    }
  }

  /**
   * Deletes a file asynchronously.
   *
   * @param filePath The path to the file to be deleted.
   * @returns A promise that resolves to true if the file was deleted successfully, false otherwise.
   */
  static async deleteFile(filePath: string) {
    if (!filePath || !fs.existsSync(filePath)) return false;

    try {
      fs.rmSync(filePath);
      return true;
    } catch (error) {
      // TODO: APPLY PROPER ERROR HANDLING
    }
    return false;
  }
}

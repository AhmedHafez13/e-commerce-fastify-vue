import sharp from 'sharp';
import fs from 'fs';

export default class ImageUtils {
  static async resizeImage(
    imagePath: string,
    outputPath: string
  ): Promise<string | null> {
    const file = fs.readFileSync(imagePath);
    const image = sharp(file.buffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) return null;

    const size = Math.max(width, height);
    const resizeOptions = width > height ? { width: size } : { hight: size };
    const blur = 24;

    try {
      const sharpOriginal = sharp(imagePath);
      const resizedBuffer = await sharpOriginal
        .resize(resizeOptions)
        .toBuffer();
      await sharpOriginal
        .resize(size, size, { fit: 'cover' })
        .blur(blur)
        .composite([{ input: resizedBuffer, gravity: 'center' }])
        .toFile(outputPath);
      return outputPath;
    } catch (error) {
      // TODO: APPLY PROPER ERROR HANDLING
      return null;
    }
  }

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

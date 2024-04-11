const staticFilesPrefix = '/public';
const uploadsPath = process.env.PUBLIC_PATH || '/app/public';

export default {
  staticFilesPath: uploadsPath,
  staticFilesPrefix,
  internalImagesPath: `${uploadsPath}/images`,
  tempImagesPath: `${uploadsPath}/temp/images`,
  publicImagesPath: `${staticFilesPrefix}/images`,
  allowedImageExts: ['png', 'jpeg', 'jpg', 'webp'],
};

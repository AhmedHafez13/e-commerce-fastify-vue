const staticFilesPrefix = '/public';
const uploadsPath = '/app/uploads';

export default {
  staticFilesPath: uploadsPath,
  staticFilesPrefix,
  internalImagesPath: `${uploadsPath}/images`,
  tempImagesPath: `${uploadsPath}/temp/images`,
  publicImagesPath: `${staticFilesPrefix}/images`,
  allowedImageExts: ['png', 'jpeg', 'jpg'],
};

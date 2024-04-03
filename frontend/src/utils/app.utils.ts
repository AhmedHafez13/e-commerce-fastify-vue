const defaultImag = 'https://dummyimage.com/3200x3200/333/aaa';
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost';

export const getImageSrc = (url?: string | null) => {
  if (!url) return defaultImag;
  if (url.startsWith('http')) return url;
  return baseUrl + url;
};

export const getMimeType = (file: any, fallback?: string) => {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
};

export const resizeImage = (
  src: string,
  maxWidth: number,
  maxHeight: number,
  imageType: string = 'webp',
  enlarge: boolean = true
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      if (!enlarge && width <= maxWidth && height <= maxHeight) {
        resolve(src);
      }

      let newWidth = maxWidth;
      let newHeight = maxHeight;

      if (!enlarge) {
        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(image, 0, 0, newWidth, newHeight);
        resolve(canvas.toDataURL(imageType));
      } else {
        reject(src);
      }
    };
    image.onerror = reject;
  });
};

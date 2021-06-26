import path from 'path';

export const extractName = (location: string) => path.basename(location, path.extname(location));

export const isBookExtension = (extension: string) => extension === '.zip';

export const isImageExtension = (extension: string) => {
    const lowerCased = extension.toLowerCase();

    return lowerCased === '.jpg'
        || lowerCased === '.jpeg'
        || lowerCased === '.bmp'
        || lowerCased === '.png'
        || lowerCased === '.tiff';
};

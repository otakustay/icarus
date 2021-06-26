import sizeOf from 'image-size';
import {Image} from '@icarus/shared';

export const isImageExtension = (extension: string) => {
    const lowerCased = extension.toLowerCase();

    return lowerCased === '.jpg'
        || lowerCased === '.jpeg'
        || lowerCased === '.bmp'
        || lowerCased === '.png'
        || lowerCased === '.tiff';
};

export const constructImageInfo = (name: string, contentBuffer: Buffer): Image => {
    const info = sizeOf(contentBuffer);

    /* istanbul ignore next */
    if (info.width === undefined || info.height === undefined || info.type === undefined) {
        throw new Error(`Cannot detect size of ${name}`);
    }

    return {
        name,
        width: info.width,
        height: info.height,
        content: `data:image/${info.type};base64,${contentBuffer.toString('base64')}`,
    };
};

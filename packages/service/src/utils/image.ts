import path from 'path';
import sizeOf from 'image-size';
import {Image} from '@icarus/shared';

const isUnwantedImage = (filename: string) => {
    return filename.includes('__MACOSX');
};

const isImageExtension = (extension: string) => {
    const lowerCased = extension.toLowerCase();

    return lowerCased === '.jpg'
        || lowerCased === '.jpeg'
        || lowerCased === '.bmp'
        || lowerCased === '.png'
        || lowerCased === '.tiff';
};

export const isReadableImage = (filename: string) => {
    const extension = path.extname(filename);
    return isImageExtension(extension) && !isUnwantedImage(filename);
};

export const constructImageInfo = (name: string, contentBuffer: Buffer): Image => {
    const info = sizeOf(contentBuffer);

    /* istanbul ignore next */
    if (info.width === undefined || info.height === undefined || info.type === undefined) {
        throw new Error(`Cannot detect size of ${name}`);
    }

    // 根据EXIF的定义，`orientation`在5、6、7、8是宽高反转的
    // 0x0112 Orientation int16u IFD0
    //     1 = Horizontal (normal)
    //     2 = Mirror horizontal
    //     3 = Rotate 180
    //     4 = Mirror vertical
    //     5 = Mirror horizontal and rotate 270 CW
    //     6 = Rotate 90 CW
    //     7 = Mirror horizontal and rotate 90 CW
    //     8 = Rotate 270 CW
    const shouldSwitchWidthAndHeight = info.orientation && info.orientation >= 5 && info.orientation <= 8;
    return {
        name,
        width: shouldSwitchWidthAndHeight ? info.height : info.width,
        height: shouldSwitchWidthAndHeight ? info.width : info.height,
        content: `data:image/${info.type};base64,${contentBuffer.toString('base64')}`,
    };
};

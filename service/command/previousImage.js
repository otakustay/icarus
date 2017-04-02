import sizeOf from 'image-size';
import log4js from 'log4js';
import {datauri} from '../util';
import previousArchive from './previousArchive';

let logger = log4js.getLogger('previousImage');

export default async (context, sender) => {
    logger.info('Start process');

    let image = context.imageList.previous();

    if (!image) {
        logger.info('Already at the first image, move to previous archive');

        await previousArchive(context, sender, {moveToLast: true});
        return;
    }

    await context.persist();

    let buffer = await context.browsingArchive.readEntry(image);
    let imageSize = (buffer.byteLength / 1024).toFixed(2);
    let dimension = sizeOf(buffer);

    logger.trace(`Image is ${image.entryName} (${imageSize}KB)`);

    let uri = datauri(image.entryName, buffer);

    logger.info('Send image command to renderer');

    sender.send(
        'image',
        {
            uri: uri,
            name: image.entryName,
            width: dimension.width,
            height: dimension.height
        }
    );
};

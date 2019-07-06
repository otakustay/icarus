import {getLogger} from '../util/logger';
import sizeOf from 'image-size';
import {datauri} from '../util';
import nextArchive from './nextArchive';

const logger = getLogger('nextImage');

export default async (context, sender) => {
    logger.info('Start process');

    const image = context.imageList.next();

    if (!image) {
        logger.info('Already at the last image, move to next archive');

        await nextArchive(context, sender);
        return;
    }

    await context.persist();

    const buffer = await context.browsingArchive.readEntry(image);
    const imageSize = (buffer.byteLength / 1024).toFixed(2);
    const dimension = sizeOf(buffer);

    logger.silly(`Image is ${image.entryName} (${imageSize}KB)`);

    const uri = datauri(image.entryName, buffer);

    logger.info('Send image command to renderer');

    sender.send(
        'image',
        {
            uri: uri,
            name: image.entryName,
            width: dimension.width,
            height: dimension.height,
        }
    );
};

import {imageSize as sizeOf} from 'image-size';
import {CommandHandler} from '../../types';
import {getLogger} from '../util/logger';
import {datauri} from '../util';
import previousArchive from './previousArchive';

const logger = getLogger('previousImage');

const execute: CommandHandler<null> = async (context, sender) => {
    logger.info('Start process');

    const image = context.imageList.previous();

    if (!image) {
        logger.info('Already at the first image, move to previous archive');

        await previousArchive(context, sender, {moveToLast: true});
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
            uri,
            name: image.entryName,
            width: dimension.width,
            height: dimension.height,
        }
    );
};

export default execute;

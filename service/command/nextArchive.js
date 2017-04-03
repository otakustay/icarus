import log4js from 'log4js';
import {unpack} from '../util';
import nextImage from './nextImage';

let logger = log4js.getLogger('nextArchive');

let nextArchive = async (context, sender) => {
    logger.info('Start process');

    let file = context.archiveList.next();

    if (!file) {
        logger.info('Already at the last archive, send no-more command to renderer');
        sender.send('no-more', {direction: 'forward'});
        return;
    }

    logger.info(`Unpacking ${file}`);

    let archive = await unpack(file);

    if (!archive.entries.length) {
        logger.warn(`There is no image file in ${file}, move to next archive`);
        await nextArchive(context, sender);
        return;
    }

    context.setBrowsingArchive(archive);

    logger.info('Send archive command to renderer');

    let info = await context.storage.getArchiveInfo(file);
    sender.send('archive', info);

    logger.trace('Open the first image in archive');

    await nextImage(context, sender);
};

export default nextArchive;

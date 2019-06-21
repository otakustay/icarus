import {getLogger} from '../util/logger';
import {unpack} from '../util';
import nextImage from './nextImage';

const logger = getLogger('nextArchive');

const nextArchive = async (context, sender) => {
    logger.info('Start process');

    const file = context.archiveList.next();

    if (!file) {
        logger.info('Already at the last archive, send no-more command to renderer');
        sender.send('no-more', {direction: 'forward'});
        return;
    }

    logger.info(`Unpacking ${file}`);

    const archive = await unpack(file);

    if (!archive.entries.length) {
        logger.warn(`There is no image file in ${file}, move to next archive`);
        await nextArchive(context, sender);
        return;
    }

    context.setBrowsingArchive(archive);

    logger.info('Send archive command to renderer');

    const info = {
        ...await context.storage.getArchiveInfo(file),
        total: context.archiveList.size(),
        index: context.archiveList.currentIndex(),
    };
    sender.send('archive', info);

    logger.trace('Open the first image in archive');

    await nextImage(context, sender);
};

export default nextArchive;

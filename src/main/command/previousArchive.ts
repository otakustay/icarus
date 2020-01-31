import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';
import {unpack} from '../util';
import nextImage from './nextImage';

interface PreviousArchiveOptions {
    moveToLast: boolean;
}

const DEFAULT_OPTIONS: PreviousArchiveOptions = {moveToLast: false};

const logger = getLogger('previousArchive');

const execute: CommandHandler<PreviousArchiveOptions> = async (context, sender, options = DEFAULT_OPTIONS) => {
    logger.info('Start process');

    const file = context.archiveList.previous();

    if (!file) {
        logger.info('Already at the first archive, send no-more command to renderer');
        sender.send('no-more', {direction: 'backward'});
        return;
    }

    logger.info(`Unpacking ${file}`);

    const archive = await unpack(file);

    if (!archive.entries.length) {
        logger.warn(`There is no image file in ${file}, move to previous archive`);
        sender.send('service-error', {message: `There is no image file in ${file}`});
        await execute(context, sender, options);
        return;
    }

    context.setBrowsingArchive(archive, options);

    logger.info('Send archive command to renderer');

    const info = {
        ...await context.storage.getArchiveInfo(file),
        total: context.archiveList.size(),
        index: context.archiveList.currentIndex(),
    };
    sender.send('archive', info);

    logger.silly('Open the ' + (options.moveToLast ? 'last' : 'first') + ' image in archive');

    await nextImage(context, sender, null);
};

export default execute;

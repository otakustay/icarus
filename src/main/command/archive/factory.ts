import {CommandHandler} from '../../../interface';
import {getLogger} from '../../util/logger';
import {unpack} from '../../util';
import {nextImage} from '../image';

interface MoveArchiveOptions {
    moveToLast: boolean;
}

export default (type: 'previous' | 'next') => {
    const logger = getLogger(type + 'Archive');

    const execute: CommandHandler<MoveArchiveOptions | undefined> = async (context, sender, options) => {
        logger.info('Start process');

        const file = type === 'previous' ? context.archiveList.previous() : context.archiveList.next();

        if (!file) {
            logger.info('No more archive in list, send no-more command to renderer');
            sender.send('no-more', {direction: type === 'previous' ? 'backward' : 'forward'});
            return;
        }

        logger.info(`Unpacking ${file}`);

        const archive = await unpack(file);

        if (!archive.entries.length) {
            logger.warn(`There is no image file in ${file}, move to next archive`);
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

        logger.silly('Open the ' + (options?.moveToLast ? 'last' : 'first') + ' image in archive');

        await nextImage(context, sender, null);
    };

    return execute;
};

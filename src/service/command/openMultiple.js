import log4js from 'log4js';
import nextArchive from './nextArchive';

const logger = log4js.getLogger('openMultiple');

export default async (context, sender, archiveList) => {
    if (!archiveList || !archiveList.length) {
        logger.warn('No archives provided');
        return;
    }

    logger.info(`Start process ${archiveList.length} archives`);

    context.setArchiveList(archiveList);

    logger.info('Send directory command to renderer');

    sender.send('list', {archiveList: context.archiveList.toArray()});

    logger.trace('Open the first selected archive');

    await nextArchive(context, sender);
};

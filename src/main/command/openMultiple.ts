import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';
import moveToArchive from './archive';

const logger = getLogger('openMultiple');

const execute: CommandHandler<string[]> = async (context, sender, archiveList) => {
    if (!archiveList || !archiveList.length) {
        logger.warn('No archives provided');
        return;
    }

    logger.info(`Start process ${archiveList.length} archives`);

    context.setArchiveList(archiveList);

    logger.info('Send directory command to renderer');

    sender.send('list', {archiveList: context.archiveList.toArray()});

    logger.silly('Open the first selected archive');

    const currentIndex = context.archiveList.currentIndex();
    await moveToArchive(context, sender, {index: currentIndex + 1, moveToLast: false});
};

export default execute;

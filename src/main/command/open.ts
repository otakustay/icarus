import path from 'path';
import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';
import {list} from '../util';
import moveToArchive from './archive';

const logger = getLogger('open');

const execute: CommandHandler<string> = async (context, sender, file) => {
    if (!file) {
        logger.error('No file provided');
        return;
    }

    logger.info(`Start process file ${file}`);

    const extension = path.extname(file);

    if (!extension) {
        logger.silly('This is a directory');
    }

    const directory = extension ? path.dirname(file) : file;

    logger.info(`Listing ${directory}`);

    const archiveList = await list(directory);

    if (!archiveList) {
        logger.warn(`There is no valid archive in ${directory}`);
        return;
    }

    if (extension) {
        context.setArchiveList(archiveList, file);
    }
    else {
        context.setArchiveList(archiveList);
    }

    logger.info('Send directory command to renderer');

    sender.send('list', {archiveList: context.archiveList.toArray()});

    logger.silly('Open ' + (extension ? file : 'the first archive'));

    const currentIndex = context.archiveList.currentIndex();
    await moveToArchive(context, sender, {index: currentIndex + 1, moveToLast: false});
};

export default execute;

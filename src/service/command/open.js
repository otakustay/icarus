import path from 'path';
import log4js from 'log4js';
import {list} from '../util';
import nextArchive from './nextArchive';

const logger = log4js.getLogger('open');

export default async (context, sender, file) => {
    if (!file) {
        logger.error('No file provided');
        return;
    }

    logger.info(`Start process file ${file}`);

    const extension = path.extname(file);

    if (!extension) {
        logger.trace('This is a directory');
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

    logger.trace('Open ' + (extension ? file : 'the first archive'));

    await nextArchive(context, sender);
};

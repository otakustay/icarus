import log4js from 'log4js';
import {unpack} from '../util';
import nextImage from './nextImage';

const DEFAULT_OPTIONS = {moveToLast: false};

let logger = log4js.getLogger('previousArchive');

let previousArchive = async (context, sender, options) => {
    logger.info('Start process');

    options = options || DEFAULT_OPTIONS;

    let file = context.archiveList.previous();

    if (!file) {
        logger.info('Already at the first archive, send no-more command to renderer');
        sender.send('no-more', {direction: 'backward'});
        return;
    }

    logger.info(`Unpacking ${file}`);

    let archive = await unpack(file);

    if (!archive.entries.length) {
        logger.warn(`There is no image file in ${file}, move to next archive`);
        await previousArchive(context, sender);
        return;
    }

    context.setBrowsingArchive(archive, options);

    logger.info('Send archive command to renderer');

    let info = {
        ...await context.storage.getArchiveInfo(file),
        total: context.archiveList.size(),
        index: context.archiveList.currentIndex()
    };
    sender.send('archive', info);

    logger.trace('Open the ' + options.moveToLast ? 'last' : 'first' + ' image in archive');

    await nextImage(context, sender);
};

export default previousArchive;

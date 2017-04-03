import log4js from 'log4js';
import {unpack} from '../util';
import nextImage from './nextImage';

let logger = log4js.getLogger('restore');

export default async (context, sender) => {
    logger.info('Start process');

    let persistData = await context.storage.restoreState();

    if (!persistData) {
        sender.send('no-state');
        return;
    }

    context.setArchiveList(persistData.archiveList, persistData.archive);

    logger.trace('Archive list restored');

    let file = context.archiveList.next();
    let archive = await unpack(file);
    context.setBrowsingArchive(archive, {moveToImage: persistData.image});

    logger.info('Send archive command to renderer');

    let info = await context.storage.getArchiveInfo(file);
    sender.send('archive', info);

    logger.trace('Image list restored');

    logger.info('Move to open image');

    await nextImage(context, sender);
};

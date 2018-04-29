import log4js from 'log4js';
import {map} from 'lodash';
import {unpack, bareName} from '../util';
import nextImage from './nextImage';

const logger = log4js.getLogger('restore');

export default async (context, sender) => {
    logger.info('Start process');

    const persistData = await context.storage.restoreState();

    if (!persistData) {
        sender.send('no-state');
        return;
    }

    let archiveList = persistData.archiveList;
    if (persistData.filter) {
        logger.info('Found filter tags, send filter command to renderer');

        sender.send('filter', persistData.filter.tags);

        context.setFilterTags(persistData.filter.tags);

        const filteredArchiveInfos = await context.storage.findArchivesByTags(persistData.filter.tags);
        const filterSet = new Set(map(filteredArchiveInfos, 'archive'));
        archiveList = archiveList.filter(path => filterSet.has(bareName(path)));

        logger.trace(`Filtered ${archiveList.length} archives with tag ${persistData.filter.tags}`);
    }

    const container = persistData.filter || persistData;
    context.setArchiveList(archiveList, container.archive);

    logger.trace('Archive list restored');

    const file = context.archiveList.next();
    const archive = await unpack(file);
    context.setBrowsingArchive(archive, {moveToImage: container.image});

    logger.info('Send archive command to renderer');

    const info = {
        ...await context.storage.getArchiveInfo(file),
        total: context.archiveList.size(),
        index: context.archiveList.currentIndex()
    };
    sender.send('archive', info);

    logger.trace('Image list restored');

    logger.info('Move to open image');

    await nextImage(context, sender);
};

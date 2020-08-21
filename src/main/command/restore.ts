import {map} from 'lodash';
import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';
import {unpack, bareName} from '../util';
import {nextImage} from './image';

const logger = getLogger('restore');

const execute: CommandHandler<null> = async (context, sender) => {
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

        logger.silly(`Filtered ${archiveList.length} archives with tag ${persistData.filter.tags}`);
    }

    const container = persistData.filter || persistData;
    context.setArchiveList(archiveList, container.archive);

    logger.silly('Archive list restored');

    const file = context.archiveList.next();

    if (!file) {
        logger.warn('No archives in saved state, possibly a broken state');
        sender.send('no-more');
        return;
    }

    const archive = await unpack(file);
    context.setBrowsingArchive(archive, {moveToImage: container.image});

    logger.info('Send archive command to renderer');

    const info = {
        ...await context.storage.getArchiveInfo(file),
        total: context.archiveList.size(),
        index: context.archiveList.currentIndex(),
    };
    sender.send('archive', info);

    logger.silly('Image list restored');

    logger.info('Move to open image');

    await nextImage(context, sender, null);
};

export default execute;

import log4js from 'log4js';
import {map, omit} from 'lodash';
import {bareName} from '../util';
import nextArchive from './nextArchive';
import restore from './restore';

const logger = log4js.getLogger('filter');

export default async (context, sender, tags) => {
    logger.info('Start process');

    context.setFilterTags(tags);

    const savedState = await context.storage.restoreState();

    if (tags.length) {
        const filteredArchiveInfos = await context.storage.findArchivesByTags(tags);
        const filterSet = new Set(map(filteredArchiveInfos, 'archive'));
        const archiveList = savedState.archiveList.filter(path => filterSet.has(bareName(path)));

        logger.info(`Filtered ${archiveList.length} archives with tag ${tags}`);

        context.setArchiveList(archiveList);

        logger.info('Move to first archive');

        await nextArchive(context, sender);
    }
    else {
        logger.info('Remove filter from saved state');

        await context.storage.saveState(omit(savedState, 'filter'));

        logger.info('Restore non-filtered state');

        await restore(context, sender);
    }
};

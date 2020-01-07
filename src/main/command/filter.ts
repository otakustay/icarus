import {map} from 'lodash';
import {getLogger} from '../util/logger';
import {CommandHandler} from '../../types';
import {bareName} from '../util';
import nextArchive from './nextArchive';
import restore from './restore';

const logger = getLogger('filter');

const execute: CommandHandler<string[]> = async (context, sender, tags) => {
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

        await nextArchive(context, sender, null);
    }
    else {
        logger.info('Remove filter from saved state');

        await context.storage.saveState({...savedState, filter: null});

        logger.info('Restore non-filtered state');

        await restore(context, sender, null);
    }
};

export default execute;

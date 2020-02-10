import {CommandHandler} from '../../../interface';
import {getLogger} from '../../util/logger';
import Util from './Util';

export default (type: 'previous' | 'next') => {
    const logger = getLogger('nextImage');

    const execute: CommandHandler<null> = async (context, sender) => {
        const util = new Util(context, sender, logger);
        logger.info('Start process');

        const image = type === 'previous' ? context.imageList.previous() : context.imageList.next();

        if (!image) {
            await util.moveToArchive(type);
            return;
        }

        await context.persist();

        const currentArchive = context.archiveList.current();
        const cachedImage = type === 'previous' ? context.imageCache.moveToPrevious() : context.imageCache.moveToNext();

        if (cachedImage?.archive === currentArchive && cachedImage?.name === image?.entryName) {
            logger.silly(`Loaded ${type} image from cache`);

            util.terminatePendingCache();
            util.sendToClient(cachedImage);
            util.cache(type);
            return;
        }

        const current = await util.readImage(image);
        context.imageCache.setCurrent(util.cacheKey(current), current);
        util.terminatePendingCache();
        util.sendToClient(current);
        util.cache('previous');
        util.cache('next');
    };

    return execute;
};

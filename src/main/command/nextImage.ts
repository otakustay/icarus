import {imageSize as sizeOf} from 'image-size';
import {WebContents} from 'electron';
import {getLogger} from '../util/logger';
import {CommandHandler, AppContext, ArchiveEntry, ClientImageInfo, BackendImageInfo} from '../../interface';
import {datauri} from '../util';
import nextArchive from './nextArchive';

const logger = getLogger('nextImage');

const cacheKey = (archive: string, image: string): string => `${archive}/${image}`;

const readImage = async (context: AppContext, entry: ArchiveEntry): Promise<BackendImageInfo> => {
    const buffer = await context.browsingArchive.readEntry(entry);
    return {
        archive: context.archiveList.current(),
        name: entry.entryName,
        content: buffer,
    };
};

const sendToClient = (sender: WebContents, {name, content}: BackendImageInfo): void => {
    const imageSize = (content.byteLength / 1024).toFixed(2);
    const {width = 0, height = 0} = sizeOf(content);

    logger.silly(`Image is ${name} (${imageSize}KB)`);

    const uri = datauri(name, content);

    logger.info('Send image command to renderer');

    const response: ClientImageInfo = {uri, name, width, height};
    sender.send('image', response);
};

const cache = async (type: 'previous' | 'next', context: AppContext): Promise<void> => {
    const currentKey = cacheKey(context.archiveList.current(), context.imageList.current().entryName);
    const image = type === 'previous' ? context.imageList.peakPrevious() : context.imageList.peakNext();

    if (image) {
        const info = await readImage(context, image);
        const infoKey = cacheKey(info.archive, info.name);
        const cached = type === 'previous'
            ? context.imageCache.cachePrevious(currentKey, infoKey, info)
            : context.imageCache.cacheNext(currentKey, infoKey, info);

        if (cached) {
            logger.silly(`Cached ${infoKey} successfully`);
        }
        else {
            logger.silly(`Discard expired cache ${infoKey}`);
        }
    }
};

const execute: CommandHandler<null> = async (context, sender) => {
    logger.info('Start process');

    const image = context.imageList.next();

    if (!image) {
        logger.info('Already at the last image, move to next archive');

        await nextArchive(context, sender, null);
        return;
    }

    await context.persist();

    const currentArchive = context.archiveList.current();
    const cachedImage = context.imageCache.moveToNext();

    if (cachedImage?.archive === currentArchive && cachedImage?.name === image?.entryName) {
        logger.silly('Loaded next image from cache');

        sendToClient(sender, cachedImage);
        cache('next', context);
        return;
    }

    const current = await readImage(context, image);
    context.imageCache.setCurrent(cacheKey(current.archive, current.name), current);
    sendToClient(sender, current);

    cache('previous', context);
    cache('next', context);
};

export default execute;

import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';
import {unpack} from '../util';
import {nextImage} from './image';

const logger = getLogger('archive');

interface MoveArchiveOptions {
    index: number;
    moveToLast: boolean;
}

const execute: CommandHandler<MoveArchiveOptions> = async (context, sender, options) => {
    logger.info('Start process');

    const file = context.archiveList.move(options.index);

    if (!file) {
        logger.info('No more archive in list, send no-more command to renderer');
        sender.send('no-more');
        return;
    }

    logger.info(`Unpacking ${file}`);

    const archive = await unpack(file);

    // TODO: 需要前端处理压缩文件无图片
    context.setBrowsingArchive(archive, options);

    logger.info('Send archive command to renderer');

    const info = {
        ...await context.storage.getArchiveInfo(file),
        total: context.archiveList.size(),
        index: context.archiveList.currentIndex(),
    };
    sender.send('archive', info);

    logger.silly('Open the ' + (options.moveToLast ? 'last' : 'first') + ' image in archive');

    await nextImage(context, sender, null);
};

export default execute;

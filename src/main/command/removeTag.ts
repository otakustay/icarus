import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';

const logger = getLogger('removeTag');

export interface RemoveTagCommandArgs {
    archive: string;
    tag: string;
}

const execute: CommandHandler<RemoveTagCommandArgs> = async (context, sender, {archive, tag}) => {
    logger.info('Start process');

    await context.storage.removeTag(archive, tag);

    const allTags = await context.storage.allTags();

    sender.send('tag', {all: allTags});
};

export default execute;

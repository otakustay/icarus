import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';

const logger = getLogger('addTag');

export interface AddTagCommandArgs {
    archive: string;
    tag: string;
}

const execute: CommandHandler<AddTagCommandArgs> = async (context, sender, {archive, tag}) => {
    logger.info('Start process');

    await context.storage.addTag(archive, tag);
    const allTags = await context.storage.allTags();
    sender.send('tag', allTags);
};

export default execute;

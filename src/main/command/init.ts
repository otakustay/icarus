import {CommandHandler} from '../../interface';
import {getLogger} from '../util/logger';

const logger = getLogger('init');

const execute: CommandHandler<null> = async (context, sender) => {
    logger.info('Start process');

    const [all, collisions] = await Promise.all([context.storage.allTags(), context.storage.tagCollisions()]);

    sender.send('init', {all, collisions});
};

export default execute;

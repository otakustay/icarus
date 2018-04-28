import log4js from 'log4js';

const logger = log4js.getLogger('init');

export default async (context, sender) => {
    logger.info('Start process');

    const [all, collisions] = await Promise.all([context.storage.allTags(), context.storage.tagCollisions()]);

    sender.send('init', {tags: {all, collisions}});
};

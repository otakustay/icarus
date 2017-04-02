import log4js from 'log4js';

let logger = log4js.getLogger('init');

export default async (context, sender) => {
    logger.info('Start process');

    let tagCollisions = await context.storage.tagCollisions();

    sender.send('init', {tagCollisions});
};

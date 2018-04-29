import log4js from 'log4js';

const logger = log4js.getLogger('addTag');

export default async (context, sender, {archive, tag}) => {
    logger.info('Start process');

    await context.storage.addTag(archive, tag);

    const allTags = await context.storage.allTags();

    sender.send('tag', {all: allTags});
};

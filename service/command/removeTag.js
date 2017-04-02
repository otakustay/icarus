import log4js from 'log4js';

let logger = log4js.getLogger('removeTag');

export default async (context, sender, {archive, tag}) => {
    logger.info('Start process');

    await context.storage.removeTag(archive, tag);
};

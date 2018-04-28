import log4js from 'log4js';
import * as command from './command';

const logger = log4js.getLogger('router');

const routes = {
    'open': command.open,
    'open-multiple': command.openMultiple,
    'next-archive': command.nextArchive,
    'previous-archive': command.previousArchive,
    'next-image': command.nextImage,
    'previous-image': command.previousImage,
    'restore': command.restore,
    'add-tag': command.addTag,
    'remove-tag': command.removeTag,
    'init': command.init,
    'filter': command.filter
};

export const start = context => {
    for (const [channel, command] of Object.entries(routes)) {
        /* eslint-disable no-loop-func */
        context.ipc.on(channel, ({sender}, arg) => command(context, sender, arg));
        /* eslint-enable no-loop-func */
    }

    logger.info(`Register ${Object.keys(routes).length} routes`);
};

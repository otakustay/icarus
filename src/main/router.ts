import {AppContext, CommandName, CommandHandler} from '../interface';
import {getLogger} from './util/logger';
import * as command from './command';

const logger = getLogger('router');

const routes: {[N in CommandName]: CommandHandler<any>} = {
    open: command.open,
    'open-multiple': command.openMultiple,
    'move-to-archive': command.moveToArchive,
    'next-image': command.nextImage,
    'previous-image': command.previousImage,
    restore: command.restore,
    'add-tag': command.addTag,
    'remove-tag': command.removeTag,
    init: command.init,
    filter: command.filter,
};

export const start = (context: AppContext): void => {
    for (const [channel, command] of Object.entries(routes)) {
        context.ipc.on(
            channel as CommandName,
            ({sender}, arg) => command(context, sender, arg)
        );
    }

    logger.info(`Register ${Object.keys(routes).length} routes`);
};

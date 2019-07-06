import {getLogger} from './util/logger';

const SCHEDULE_TICK = Symbol('scheduleTick');

const logger = getLogger('ipc');

export default class IPCQueue {

    constructor(ipc) {
        this.ipc = ipc;
        this.requestQueue = [];
        this.commands = {};
    }

    async flush() {
        while (this.requestQueue.length) {
            const {channel, event, arg} = this.requestQueue.shift();

            logger.debug(`Process ${channel} request` + (arg ? ` with ${JSON.stringify(arg)}` : ''));

            const handle = this.commands[channel];

            try {
                await handle(event, arg);
            }
            catch (ex) {
                logger.error(`Command ${channel} failed: ${ex}`);
                event.sender.send('service-error');
            }
        }
        this[SCHEDULE_TICK] = null;
    }

    on(channel, handler) {
        this.commands[channel] = handler;
        this.ipc.on(channel, this.enqueueRequest.bind(this, channel));
    }

    enqueueRequest(channel, event, arg) {
        logger.info(`Receive ${channel} request` + (arg ? ` with ${JSON.stringify(arg)}` : ''));

        this.requestQueue.push({channel, event, arg});
        if (!this[SCHEDULE_TICK]) {
            logger.silly('Schedule to handle all queued requests');

            this[SCHEDULE_TICK] = setImmediate(() => this.flush());
        }
    }
}

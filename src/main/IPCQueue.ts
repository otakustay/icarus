import {IpcMain, IpcMainEvent} from 'electron';
import {IPCQueue, CommandName} from '../interface';
import {getLogger} from './util/logger';

const logger = getLogger('ipc');

interface QueuedEvent {
    channel: string;
    event: IpcMainEvent;
    arg: any;
}

export default class DefaultIPCQueue implements IPCQueue {

    readonly ipc: IpcMain;

    private readonly requestQueue: QueuedEvent[] = [];

    private commands: {[name: string]: (...args: any[]) => void} = {};

    private scheduleTick: NodeJS.Immediate | null = null;


    constructor(ipc: IpcMain) {
        this.ipc = ipc;
    }

    on<TArgs = null>(channel: CommandName, handler: (event: IpcMainEvent, arg: TArgs) => void): void {
        this.commands[channel] = handler;
        this.ipc.on(channel, this.enqueueRequest.bind(this, channel));
    }

    private async flush(): Promise<void> {
        while (this.requestQueue.length) {
            const {channel, event, arg} = this.requestQueue.shift() as QueuedEvent;

            logger.debug(`Process ${channel} request` + (arg ? ` with ${JSON.stringify(arg)}` : ''));

            const handle = this.commands[channel];

            try {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await handle(event, arg);
            }
            catch (ex) {
                logger.error(`Command ${channel} failed: ${ex}`);
                event.sender.send('service-error', {message: ex.message});
            }
        }
        this.scheduleTick = null;
    }

    private enqueueRequest(channel: string, event: IpcMainEvent, arg: any) {
        logger.info(`Receive ${channel} request` + (arg ? ` with ${JSON.stringify(arg)}` : ''));

        this.requestQueue.push({channel, event, arg});

        if (!this.scheduleTick) {
            logger.silly('Schedule to handle all queued requests');

            this.scheduleTick = setImmediate(() => this.flush());
        }
    }
}

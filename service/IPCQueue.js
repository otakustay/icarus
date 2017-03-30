/**
 * @file 远程调用队列类
 *
 * @author otakustay
 */

'use strict';

let logger = require('log4js').getLogger('ipc');
const SCHEDULE_TICK = Symbol('scheduleTick');

/**
 * 远程调用队列，此类保持前端发送的指令会被依次执行，避免乱序执行造成的影响
 */
module.exports = class IPCQueue {
    constructor(ipc) {
        this.ipc = ipc;
        this.requestQueue = [];
        this.commands = {};
    }

    /**
     * 注册一个指令
     *
     * @param {string} channel 指令名称
     * @param {Function} handler 处理函数
     */
    on(channel, handler) {
        this.commands[channel] = handler;
        this.ipc.on(channel, this.enqueueRequest.bind(this, channel));
    }

    /**
     * 入队一个指令
     *
     * @protected
     * @param {string} channel 指令名称
     * @param {Event} event 事件对象
     * @param {*} arg 参数
     */
    enqueueRequest(channel, event, arg) {
        logger.info(`Receive ${channel} request` + (arg ? ` with ${JSON.stringify(arg)}` : ''));

        this.requestQueue.push({channel, event, arg});
        if (!this[SCHEDULE_TICK]) {
            logger.trace('Schedule to handle all queued requests');

            this[SCHEDULE_TICK] = setImmediate(::this.flush);
        }
    }

    /**
     * 依次执行在队列中的指令
     *
     * @protected
     */
    async flush() {
        while (this.requestQueue.length) {
            let {channel, event, arg} = this.requestQueue.shift();

            logger.debug(`Process ${channel} request` + (arg ? ` with ${JSON.stringify(arg)}` : ''));

            let handle = this.commands[channel];

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
};

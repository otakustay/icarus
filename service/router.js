'use strict'

let logger = require('log4js').getLogger('router')
let routes = {
    'open': require('./command/open'),
    'next-archive': require('./command/nextArchive'),
    'previous-archive': require('./command/previousArchive'),
    'next-image': require('./command/nextImage'),
    'previous-image': require('./command/previousImage'),
    'restore': require('./command/restore')
}

/**
 * 启动路由
 *
 * @param {service.GlobalContext} context 全局上下文
 */
exports.start = (context) => {
    for (let [channel, command] of Object.entries(routes)) {
        /* eslint-disable no-loop-func */
        context.ipc.on(channel, ({sender}, arg) => command(context, sender, arg))
        /* eslint-enable no-loop-func */
    }

    logger.info(`Register ${Object.keys(routes).length} routes`)
}

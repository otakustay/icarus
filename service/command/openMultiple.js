/**
 * @file 打开指定的多个压缩文件
 * @author otakustay
 */

'use strict';

let logger = require('log4js').getLogger('openMultiple');

/**
 * 打开客户端指定的文件或目录
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 * @param {string[]} archiveList 需要打开的文件
 */
module.exports = async (context, sender, archiveList) => {
    if (!archiveList || !archiveList.length) {
        logger.warn('No archives provided');
        return;
    }

    logger.info(`Start process ${archiveList.length} archives`);

    context.setArchiveList(archiveList);

    logger.info('Send directory command to renderer');

    sender.send('list', {archiveList: context.archiveList.toArray()});

    logger.trace('Open the first selected archive');

    await require('./nextArchive')(context, sender);
};

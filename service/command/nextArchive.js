/**
 * @file 下一个压缩文件指令
 * @author otakustay
 */

'use strict';

let unpack = require('../util/unpack');
let logger = require('log4js').getLogger('nextArchive');

/**
 * 打开下一个压缩文件
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 */
module.exports = async (context, sender) => {
    logger.info('Start process');

    let file = context.archiveList.next();

    if (!file) {
        logger.info('Already at the last archive, send no-more command to renderer');
        sender.send('no-more', {direction: 'forward'});
        return;
    }

    logger.info(`Unpacking ${file}`);

    let archive = await unpack(file);

    if (!archive.entries.length) {
        logger.warn(`There is no image file in ${file}, move to next archive`);
        await module.exports(context, sender);
        return;
    }

    context.setBrowsingArchive(archive);

    logger.info('Send archive command to renderer');

    let info = {
        ...(await context.storage.getArchiveInfo(file)),
        allTags: await context.storage.allTags()
    };
    sender.send('archive', info);

    logger.trace('Open the first image in archive');

    await require('./nextImage')(context, sender);
};

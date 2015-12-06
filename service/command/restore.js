/**
 * @file 恢复先前状态指令
 * @author otakustay
 */

'use strict';

let path = require('path');
let list = require('../util/list');
let unpack = require('../util/unpack');
let logger = require('log4js').getLogger('restore');

/**
 * 恢复之前保存的阅读进度
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 */
module.exports = async (context, sender) => {
    logger.info('Start process');

    let persistData = await context.storage.restoreState();

    if (!persistData) {
        return;
    }

    context.setBrowsingDirectory(persistData.directory);

    logger.trace('Directory restored');

    let archiveList = await list(context.browsingDirectory);
    context.setArchiveList(archiveList, persistData.archive);

    logger.trace('Archive list restored');

    let archive = context.archiveList.next();
    let imageList = await unpack(path.join(context.browsingDirectory, archive));
    let browsingImage = imageList.filter(image => image.name === persistData.image)[0];
    context.setImageList(imageList, browsingImage);

    logger.trace('Image list restored');

    logger.info(`Move to open image`);

    await require('./nextImage')(context, sender);
};

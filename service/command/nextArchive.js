/**
 * @file 下一个压缩文件指令
 * @author otakustay
 */

'use strict';

let path = require('path');
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

    let filename = context.archiveList.next();

    if (!filename) {
        logger.info('Already at the last archive, send no-more command to renderer');
        sender.send('no-more', {direction: 'forward'});
        return;
    }

    let file = path.join(context.browsingDirectory, filename);

    logger.info(`Unpacking ${file}`);

    let imageList = await unpack(file);

    if (!imageList.length) {
        logger.warn(`There is no image file in ${file}, move to next archive`);
        await module.exports(context, sender);
        return;
    }

    context.setImageList(imageList);

    logger.info('Send archive command to renderer');
    sender.send('archive', {imageList: context.imageList.toArray().map(file => file.name)});

    logger.trace('Open the first image in archive');

    await require('./nextImage')(context, sender);
};

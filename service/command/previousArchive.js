/**
 * @file 上一个压缩文件指令
 * @author otakustay
 */

'use strict';

let path = require('path');
let unpack = require('../util/unpack');
let logger = require('log4js').getLogger('previousArchive');

const DEFAULT_OPTIONS = {moveToLast: false};

/**
 * 打开上一个压缩文件
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 * @param {Object} [options] 相关配置项
 * @param {boolean} options.moveToLast = false 是否要移动到最后一张图片，由`previousImage`指令产生的移动要恢复到最后一张
 * @return {Promise}
 */
module.exports = async (context, sender, options) => {
    logger.info('Start process');

    options = options || DEFAULT_OPTIONS;

    let filename = context.archiveList.previous();

    if (!filename) {
        logger.info('Already at the first archive, send no-more command to renderer');
        sender.send('no-more', {direction: 'backward'});
        return;
    }

    let file = path.join(context.browsingDirectory, filename);

    logger.info(`Unpacking ${file}`);

    let imageList = await unpack(file);

    if (!imageList.length) {
        logger.warn(`There is no image file in ${file}, move to previous archive`);
        await module.exports(context, sender, options);
        return;
    }

    if (options.moveToLast) {
        context.setImageList(imageList, imageList[imageList.length - 1]);
    }
    else {
        context.setImageList(imageList);
    }

    logger.info('Send archive command to renderer');

    sender.send('archive', {imageList: context.imageList.toArray().map(file => file.name)});

    logger.trace('Open the ' + options.moveToLast ? 'last' : 'first' + ' image in archive');

    await require('./nextImage')(context, sender);
};

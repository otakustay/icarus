/**
 * @file 上一个压缩文件指令
 * @author otakustay
 */

'use strict';

let logger = require('log4js').getLogger('addTag');

/**
 * 打开上一个压缩文件
 *
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 * @param {Object} info 添加标签的信息
 * @param {string} info.archive 文件名
 * @param {string} info.tag 标签名
 * @return {Promise}
 */
module.exports = async (context, sender, {archive, tag}) => {
    logger.info('Start process');

    await context.storage.addTag(archive, tag);
};

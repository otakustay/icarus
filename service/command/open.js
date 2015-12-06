/**
 * @file 打开指定文件指令
 * @author otakustay
 */

'use strict';

let path = require('path');
let list = require('../util/list');
let logger = require('log4js').getLogger('open');

/**
 * 打开客户端指定的文件或目录
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 * @param {string} file 需要打开的文件或目录路径
 */
module.exports = async (context, sender, file) => {
    if (!file) {
        logger.error('No file provided');
        return;
    }

    logger.info(`Start process file ${file}`);

    let extension = path.extname(file);

    if (!extension) {
        logger.trace(`This is a directory`);
    }

    let directory = extension ? path.dirname(file) : file;

    logger.info(`Listing ${directory}`);

    let archiveList = await list(directory);

    if (!archiveList) {
        logger.warn(`There is no valid archive in ${directory}`);
        return;
    }

    if (extension) {
        context.setArchiveList(archiveList, file);
    }
    else {
        context.setArchiveList(archiveList);
    }

    logger.info('Send directory command to renderer');

    sender.send('list', {archiveList: context.archiveList.toArray()});

    logger.trace('Open ' + (extension ? file : 'the first archive'));

    await require('./nextArchive')(context, sender);
};

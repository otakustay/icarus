'use strict'

let path = require('path')
let list = require('../util/list')
let logger = require('log4js').getLogger('open')

/**
 * 打开客户端指定的文件或目录
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 */
module.exports = async (context, sender, file) => {
    if (!file) {
        logger.error('No file provided')
        return
    }

    logger.info(`Start process file ${file}`)

    let extension = path.extname(file)

    if (!extension) {
        logger.trace(`This is a directory`)
    }

    let filename = extension ? path.basename(file) : ''
    context.setBrowsingDirectory(extension ? path.dirname(file) : file)

    logger.info(`Listing ${context.browsingDirectory}`)

    let archiveList = await list(context.browsingDirectory)

    if (!archiveList) {
        logger.warn(`There is no valid archive in ${context.browsingDirectory}`)
        return
    }

    context.setArchiveList(archiveList, filename)

    logger.info('Send directory command to renderer')

    sender.send('directory', {directory: context.browsingDirectory, archiveList: context.archiveList.toArray()})

    logger.trace('Open ' + extension ? file : 'the first archive')

    await require('./nextArchive')(context, sender)
}

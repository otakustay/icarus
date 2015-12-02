'use strict'

let datauri = require('../util/datauri')
let logger = require('log4js').getLogger('previousImage')

/**
 * 打开上一个图片
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 */
module.exports = async (context, sender) => {
    logger.info('Start process')

    let image = context.imageList.previous()

    if (!image) {
        logger.info('Already at the first image, move to previous archive')

        await require('./previousArchive')(context, sender, {moveToLast: true})
        return
    }

    await context.persist()
    let buffer = image.asNodeBuffer()
    let imageSize = (buffer.byteLength / 1024).toFixed(2)

    logger.trace(`Image is ${image.name} (${imageSize}KB)`)

    let uri = datauri(image.name, buffer)
    let archive = require('path').join(context.browsingDirectory, context.archiveList.current())

    logger.info('Send image command to renderer')

    sender.send('image', {archive: archive, uri: uri, name: image.name})
}

'use strict'

let datauri = require('../util/datauri')
let logger = require('log4js').getLogger('nextImage')

/**
 * 打开下一个图片
 *
 * @protected
 * @param {service.GlobalContext} context 全局上下文
 * @param {meta.BrowserWindow} sender 发送者
 */
module.exports = async (context, sender) => {
    logger.info('Start process')

    let image = context.imageList.next()

    if (!image) {
        logger.info('Already at the last image, move to next archive')

        await require('./nextArchive')(context, sender)
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

'use strict'

let path = require('path')
let Datauri = require('datauri')

/**
 * 将图片转换为DataURI
 *
 * @param {string} name 图片文件名
 * @param {Buffer} buffer 图片数据
 * @return {string} 产生的DataURI字符串
 */
module.exports = (name, buffer) => {
    let extension = path.extname(name)
    let uri = new Datauri()
    uri.format(extension, buffer)

    return uri.content
}

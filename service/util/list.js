'use strict'

let denodeify = require('denodeify')
let glob = denodeify(require('glob'))
let path = require('path')

/**
 * 列出目录下的所有压缩文件
 *
 * @param {string} directory 目录
 * @return {string[]} 所有压缩文件的文件名（不含目录）
 */
module.exports = async (directory) => {
    let list = await glob(`${directory}/*.zip`)
    return list.map(file => path.basename(file)).sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()))
}

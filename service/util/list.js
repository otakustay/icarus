/**
 * @file 列出目录下压缩文件函数
 * @author otakustay
 */

'use strict';

let denodeify = require('denodeify');
let glob = denodeify(require('glob'));
let path = require('path');

/**
 * 列出目录下的所有压缩文件
 *
 * @param {string} directory 目录
 * @return {string[]} 所有压缩文件的文件名（不含目录）
 */
module.exports = async directory => {
    let list = await glob(`${directory}/*.{zip,rar}`);
    return list.sort((x, y) => path.basename(x).toLowerCase().localeCompare(path.basename(y).toLowerCase()));
};

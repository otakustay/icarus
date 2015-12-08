/**
 * @file 解压工具函数
 * @author otakustay
 */

'use strict';

let denodeify = require('denodeify');
let readFile = denodeify(require('fs').readFile);
let path = require('path');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp']);
const BLACKLIST = ['__MACOSX'];

/**
 * 解压压缩文件
 *
 * @param {string} file 文件完整路径
 * @return {meta.ImageFile[]} 压缩文件中的图片文件
 */
module.exports = async (file) => {
    let fileData = await readFile(file);
    let archiveContent = require('node-zip')(fileData);
    let imageList = Object.keys(archiveContent.files)
        .filter(file => !BLACKLIST.some(word => file.includes(word)))
        .filter(file => IMAGE_EXTENSIONS.has(path.extname(file)))
        .sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()))
        .map(name => archiveContent.files[name]);

    return imageList;
};

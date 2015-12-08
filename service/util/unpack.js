/**
 * @file 解压工具函数
 * @author otakustay
 */

'use strict';

let denodeify = require('denodeify');
let readFile = denodeify(require('fs').readFile);
let path = require('path');
let AdmZip = require('adm-zip');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp']);
const BLACKLIST = ['__MACOSX'];

let createImageFile = zipEntry => {
    return {
        name: zipEntry.name,
        entryName: zipEntry.entryName,
        getData() {
            return new Promise(resolve => zipEntry.getDataAsync(resolve));
        }
    };
};

/**
 * 解压压缩文件
 *
 * @param {string} file 文件完整路径
 * @return {meta.ImageFile[]} 压缩文件中的图片文件
 */
module.exports = async (file) => {
    let fileData = await readFile(file);
    let archive = new AdmZip(fileData);
    let imageList = archive.getEntries()
        .filter(entry => !BLACKLIST.some(word => entry.entryName.includes(word)))
        .filter(entry => IMAGE_EXTENSIONS.has(path.extname(entry.name)))
        .sort((x, y) => x.entryName.toLowerCase().localeCompare(y.entryName.toLowerCase()))
        .map(createImageFile);

    return imageList;
};

/**
 * @file 解压工具函数
 * @author otakustay
 */

'use strict';

let ZipArchive = require('./ZipArchive');
let RarArchive = require('./RarArchive');
let path = require('path');

/**
 * 解压压缩文件
 *
 * @param {string} file 文件完整路径
 * @return {service.util.Archive} 压缩包对象
 */
module.exports = async (file) => {
    switch (path.extname(file)) {
        case '.zip':
            return ZipArchive.create(file);
        case '.rar':
            return RarArchive.create(file);
        default:
            throw new Error('Not supported');
    }
};

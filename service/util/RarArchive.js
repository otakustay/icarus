/**
 * @file .rar压缩文件基类
 * @author otakustay
 */

'use strict';

let path = require('path');
let denodeify = require('denodeify');
let consume = denodeify(require('all-stream'));
let RarFile = require('rarfile').RarFile;
let Archive = require('./Archive');

const RAR_TOOL_PATH = path.join(__dirname, '..', '..', '3rd', 'unrar-os-x');

/**
 * Rar压缩包封装
 */
module.exports = class RarArchive extends Archive {

    /**
     * 构造函数
     *
     * @param {ZipEntry[]} rarFile 由`rarfile`生成的实例
     */
    constructor(rarFile) {
        super();
        this.rarFile = rarFile;
        this.entries = rarFile.names.map(n => ({entryName: path.basename(n), name: n}));
    }

    /**
     * @override
     */
    async readEntry({entryName}) {
        let stream = this.rarFile.readStream(entryName);

        let content = await consume(stream);
        return new Buffer(content, 'ascii');
    }

    /**
     * 从文件创建压缩包对象
     *
     * @param {string} file 文件路径
     * @return {service.util.ZipArchive} 压缩包对象
     */
    static create(file) {
        let rarFile = new RarFile(file, {rarTool: RAR_TOOL_PATH});
        return new Promise(resolve => rarFile.on('ready', () => resolve(new RarArchive(rarFile))));
    }
};

/**
 * @file .zip压缩文件基类
 * @author otakustay
 */

'use strict';

let denodeify = require('denodeify');
let readFile = denodeify(require('fs').readFile);
let Archive = require('./Archive');
let AdmZip = require('adm-zip');

/**
 * Zip压缩包封装
 */
module.exports = class ZipArchive extends Archive {

    /**
     * 构造函数
     *
     * @param {ZipEntry[]} unzippedEntries 由`adm-zip`工具解压得到的数组
     */
    constructor(unzippedEntries) {
        super();
        this.entries = unzippedEntries.map(e => ({entryName: e.entryName, name: e.name}));
        this.files = unzippedEntries.reduce(
            (result, entry) => {
                result[entry.entryName] = {
                    entry: entry,
                    getData() {
                        return new Promise(::this.entry.getDataAsync);
                    }
                };
                return result;
            },
            {}
        );
    }

    /**
     * @override
     */
    readEntry({entryName}) {
        let file = this.files[entryName];

        if (!file) {
            return Promise.reject(`No file ${entryName} in archive`);
        }

        return file.getData();
    }

    /**
     * 从文件创建压缩包对象
     *
     * @param {string} file 文件路径
     * @return {service.util.ZipArchive} 压缩包对象
     */
    static async create(file) {
        let fileData = await readFile(file);
        let archive = new AdmZip(fileData);
        return new ZipArchive(archive.getEntries());
    }
};

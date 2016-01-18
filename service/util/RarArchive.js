/**
 * @file .rar压缩文件基类
 * @author otakustay
 */

'use strict';

let path = require('path');
let denodeify = require('denodeify');
let exec = denodeify(require('child_process').exec);
let Archive = require('./Archive');

const RAR_TOOL_PATH = path.join(__dirname, '..', '..', '3rd', 'unrar-os-x');
// 在使用`electron-packager`打包后的应用程序启动时`LANG`环境变量是错误的`C`（即`ASCII`编码），会导致带中文的文件名读取全部错误
const ENV = Object.assign({}, process.env, {LANG: require('electron').app.getLocale().replace(/-/g, '_')});
const POSSIBLE_MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB

let loadRarNames = async file => {
    let command = `${RAR_TOOL_PATH} lb "${file}"`;
    let output = await exec(command, {env: ENV, encoding: 'utf8'});
    let names = output.split(/\r?\n/).map(name => ({entryName: name, name: path.basename(name)}));
    return names;
};

let readRarContentFile = (file, entryName) => {
    let command = `${RAR_TOOL_PATH} p -y -idq "${file}" "${entryName}"`;
    let result = exec(command, {env: ENV, encoding: 'buffer', maxBuffer: POSSIBLE_MAX_IMAGE_SIZE});
    return result;
};

/**
 * Rar压缩包封装
 */
module.exports = class RarArchive extends Archive {

    /**
     * 构造函数
     *
     * @param {string} file 压缩文件路径
     * @param {string[]} entries 压缩包中的文件列表
     */
    constructor(file, entries) {
        super();
        this.file = file;
        this.entries = entries;
    }

    /**
     * @override
     */
    readEntry({entryName}) {
        return readRarContentFile(this.file, entryName);
    }

    /**
     * 从文件创建压缩包对象
     *
     * @param {string} file 文件路径
     * @return {service.util.ZipArchive} 压缩包对象
     */
    static async create(file) {
        let entries = await loadRarNames(file);
        return new RarArchive(file, entries);
    }
};

import path from 'path';
import denodeify from 'denodeify';
import childProcess from 'child_process';
import electron from 'electron';
import Archive from './Archive';

let exec = denodeify(childProcess.exec);

const RAR_TOOL_PATH = path.join(__dirname, '..', '..', '3rd', 'unrar-os-x');
// 在使用`electron-packager`打包后的应用程序启动时`LANG`环境变量是错误的`C`（即`ASCII`编码），会导致带中文的文件名读取全部错误
const ENV = Object.assign({}, process.env, {LANG: electron.app.getLocale().replace(/-/g, '_')});
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

export default class RarArchive extends Archive {

    constructor(file, entries) {
        super();
        this.file = file;
        this.entries = entries;
    }

    readEntry({entryName}) {
        return readRarContentFile(this.file, entryName);
    }

    static async create(file) {
        let entries = await loadRarNames(file);
        return new RarArchive(file, entries);
    }
}

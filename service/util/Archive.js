/**
 * @file 压缩文件基类
 * @author otakustay
 */

'use strict';

const ENTRIES = Symbol('entries');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp']);
const BLACKLIST = ['__MACOSX'];

let findNumber = str => {
    let matches = /(\d+)[^\d]*$/.exec(str);
    return matches && +matches[1];
};

let smartCompare = (x, y) => {
    let numberX = findNumber(x);
    let numberY = findNumber(y);
    let isAllNumber = typeof numberX === 'number' && typeof numberY === 'number';
    return isAllNumber ? numberX - numberY : x.toLowerCase().localeCompare(y.toLowerCase());
};

/**
 * 压缩文件基类
 */
module.exports = class Archive {

    /**
     * 压缩文件中的文件列表
     *
     * @property {meta.ArchiveEntryp[]} entries
     */
    get entries() {
        return this[ENTRIES];
    }

    set entries(list) {
        let entries = list
            .filter(entry => !BLACKLIST.some(word => entry.entryName.includes(word)))
            .filter(entry => IMAGE_EXTENSIONS.has(require('path').extname(entry.name)))
            .sort((x, y) => smartCompare(x.entryName, y.entryName));
        this[ENTRIES] = entries;
    }

    /**
     * 获取指定文件的Buffer
     *
     * @abstract
     * @param {meta.ArchiveEntry} entry 需要读取的项
     * @return {Promise.<Buffer>}
     */
    readEntry(entry) {
        throw new Error('Not implement');
    }
};

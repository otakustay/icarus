import path from 'path';
import {standalone} from 'path-sort';

const ENTRIES = Symbol('entries');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp']);
const BLACKLIST = ['__MACOSX'];

export default class Archive {

    /**
     * 压缩文件中的文件列表
     *
     * @property {meta.ArchiveEntryp[]} entries
     */
    get entries() {
        return this[ENTRIES];
    }

    set entries(list) {
        let compare = standalone('/');
        let entries = list
            .filter(entry => !BLACKLIST.some(word => entry.entryName.includes(word)))
            .filter(entry => IMAGE_EXTENSIONS.has(path.extname(entry.name)))
            .sort((x, y) => compare(x.entryName, y.entryName));

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
}

import denodeify from 'denodeify';
import fs from 'fs';
import AdmZip from 'adm-zip';
import chardet from 'jschardet';
import iconv from 'iconv-lite';
import Archive from './Archive';

let readFile = denodeify(fs.readFile);

let decodeName = buffer => iconv.decode(buffer, chardet.detect(buffer).encoding);
let pickEntry = e => {
    return {
        entryName: decodeName(e.rawEntryName),
        originalEntryName: e.entryName,
        name: e.name
    };
};

export default class ZipArchive extends Archive {

    constructor(unzippedEntries) {
        super();
        this.entries = unzippedEntries.map(pickEntry);
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

    readEntry({entryName, originalEntryName}) {
        let file = this.files[originalEntryName];

        if (!file) {
            return Promise.reject(`No file ${entryName} in archive`);
        }

        return file.getData();
    }

    static async create(file) {
        let fileData = await readFile(file);
        let archive = new AdmZip(fileData);
        return new ZipArchive(archive.getEntries());
    }
}

import fs from 'fs';
import denodeify from 'denodeify';
import AdmZip from 'adm-zip';
import chardet from 'jschardet';
import iconv from 'iconv-lite';
import Archive from './Archive';

const readFile = denodeify(fs.readFile);

const decodeName = buffer => iconv.decode(buffer, chardet.detect(buffer).encoding);
const pickEntry = e => {
    return {
        entryName: decodeName(e.rawEntryName),
        originalEntryName: e.entryName,
        name: e.name,
    };
};

export default class ZipArchive extends Archive {

    constructor(unzippedEntries) {
        super();
        this.entries = unzippedEntries.map(pickEntry);
        this.files = unzippedEntries.reduce(
            (result, entry) => {
                const entryValue = {
                    entry: entry,
                    getData() {
                        return new Promise(resolve => this.entry.getDataAsync(resolve));
                    },
                };
                return {...result, [entry.entryName]: entryValue};
            },
            {}
        );
    }

    readEntry({entryName, originalEntryName}) {
        const file = this.files[originalEntryName];

        if (!file) {
            return Promise.reject(new Error(`No file ${entryName} in archive`));
        }

        return file.getData();
    }

    static async create(file) {
        const fileData = await readFile(file);
        const archive = new AdmZip(fileData);
        return new ZipArchive(archive.getEntries());
    }
}

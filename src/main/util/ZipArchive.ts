import * as fs from 'fs';
import {promisify} from 'util';
import AdmZip, {IZipEntry} from 'adm-zip';
import * as chardet from 'jschardet';
import iconv from 'iconv-lite';
import {ZipArchiveEntry} from '../../interface';
import Archive from './Archive';

const readFile = promisify(fs.readFile);

const decodeName = (buffer: Buffer): string => iconv.decode(buffer, chardet.detect(buffer).encoding);
const pickEntry = (e: IZipEntry): ZipArchiveEntry => {
    return {
        entryName: decodeName(e.rawEntryName),
        originalEntryName: e.entryName,
        name: e.name,
    };
};

interface RarFileEntry {
    entry: IZipEntry;
    getData(): Promise<Buffer>;
}

export default class ZipArchive extends Archive {

    private readonly files: {[name: string]: RarFileEntry} = {};

    constructor(unzippedEntries: IZipEntry[]) {
        super();
        this.entries = unzippedEntries.map(pickEntry);
        this.files = unzippedEntries.reduce(
            (result, entry) => {
                const entryValue: RarFileEntry = {
                    entry,
                    getData() {
                        return new Promise(resolve => this.entry.getDataAsync(resolve));
                    },
                };
                return {...result, [entry.entryName]: entryValue};
            },
            {}
        );
    }

    static async create(file: string): Promise<ZipArchive> {
        const fileData = await readFile(file);
        const archive = new AdmZip(fileData);
        return new ZipArchive(archive.getEntries());
    }

    readEntry({entryName, originalEntryName}: ZipArchiveEntry) {
        const file = this.files[originalEntryName];

        if (!file) {
            return Promise.reject(new Error(`No file ${entryName} in archive`));
        }

        return file.getData();
    }
}

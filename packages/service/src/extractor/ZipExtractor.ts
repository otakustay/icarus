import path from 'path';
import fs from 'fs/promises';
import {cached} from '@icarus/shared';
import stringNaturalCompare from 'string-natural-compare';
import Zip, {IZipEntry} from 'adm-zip';
import {isImageExtension} from '../utils/image';
import {extractName} from '../utils/path';
import Extractor, {Entry} from './Extractor';

const compareEntry = (x: IZipEntry, y: IZipEntry) => {
    const xName = extractName(x.entryName);
    const yName = extractName(y.entryName);
    return stringNaturalCompare(xName, yName, {caseInsensitive: true});
};

export default class ZipExtractor implements Extractor {
    private readonly readZip: (filename: string) => Promise<Zip>;

    constructor() {
        const readZip = async (filename: string) => {
            const contentBuffer = await fs.readFile(filename);
            return new Zip(contentBuffer);
        };
        this.readZip = cached(readZip);
    }

    async readEntryAt(file: string, index: number): Promise<Entry> {
        const zip = await this.readZip(file);
        const images = zip.getEntries().filter(v => isImageExtension(path.extname(v.entryName))).sort(compareEntry);

        if (index < 0 || index >= images.length) {
            throw new Error('Image index out of range');
        }

        const entry = images[index];
        return {
            entryName: entry.entryName,
            contentBuffer: images[index].getData(),
        };
    }
}

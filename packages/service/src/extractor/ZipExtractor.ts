import path from 'path';
import fs from 'fs/promises';
import {cached} from '@icarus/shared';
import Zip from 'adm-zip';
import {isImageExtension} from '../utils/book';
import Extractor from './Extractor';

export default class ZipExtractor implements Extractor {
    private readonly readZip: (filename: string) => Promise<Zip>;

    constructor() {
        const readZip = async (filename: string) => {
            const contentBuffer = await fs.readFile(filename);
            return new Zip(contentBuffer);
        };
        this.readZip = cached(readZip);
    }

    async readEntryAt(file: string, index: number): Promise<Buffer> {
        const zip = await this.readZip(file);
        const images = zip.getEntries().filter(v => isImageExtension(path.extname(v.entryName)));

        if (index < 0 || index >= images.length) {
            throw new Error('Image index out of range');
        }

        return images[index].getData();
    }
}

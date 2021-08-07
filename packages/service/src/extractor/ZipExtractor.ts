import fs from 'fs/promises';
import {cached} from '@icarus/shared';
import stringNaturalCompare from 'string-natural-compare';
import Zip, {IZipEntry} from 'adm-zip';
import {isReadableImage} from '../utils/image';
import {extractName} from '../utils/path';
import Extractor, {Entry} from './Extractor';

type Predict = (current: string) => Promise<string[]>;

const compareEntry = (x: IZipEntry, y: IZipEntry) => {
    const xName = extractName(x.entryName);
    const yName = extractName(y.entryName);
    return stringNaturalCompare(xName, yName, {caseInsensitive: true});
};

export default class ZipExtractor implements Extractor {
    private readonly readZip: (filename: string) => Promise<Zip>;
    private readonly predict?: Predict;

    constructor(cacheCapacity?: number, predict?: Predict) {
        const readZip = async (filename: string) => {
            const contentBuffer = await fs.readFile(filename);
            return new Zip(contentBuffer);
        };
        this.readZip = cached(readZip, cacheCapacity);
        this.predict = predict;
    }

    async readEntryAt(file: string, index: number): Promise<Entry> {
        const zip = await this.readZip(file);
        const images = zip.getEntries().filter(v => isReadableImage(v.entryName)).sort(compareEntry);

        if (index < 0 || index >= images.length) {
            throw new Error('Image index out of range');
        }

        this.prepareCache(file).catch(() => undefined);

        const entry = images[index];
        return {
            entryName: entry.entryName,
            contentBuffer: images[index].getData(),
        };
    }

    private async prepareCache(file: string) {
        // 缓存可预测的内容
        const prediction = await this.predict?.(file);
        if (prediction) {
            return Promise.all(prediction.map(v => this.readZip(v)));
        }
    }
}

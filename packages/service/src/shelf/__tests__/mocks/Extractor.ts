import Extractor, {Entry} from '../../../extractor/Extractor';

const EMPTY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8=';

const ERROR_IMAGE_INDEX = new Set([0, 1, 5, 6, 10, 11]);

export default class TestExtractor implements Extractor {
    async readEntryAt(file: string, index: number): Promise<Entry> {
        if (file.includes('error') && ERROR_IMAGE_INDEX.has(index)) {
            throw new Error(`Error extract file ${file}`);
        }

        return {
            entryName: `${file}/${index}`,
            contentBuffer: Buffer.from(EMPTY_PNG_BASE64, 'base64'),
        };
    }
}

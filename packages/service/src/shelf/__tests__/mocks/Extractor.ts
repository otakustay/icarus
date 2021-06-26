import Extractor, {Entry} from '../../../extractor/Extractor';

const EMPTY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8=';

export default class TestExtractor implements Extractor {
    async readEntryAt(file: string, index: number): Promise<Entry> {
        return {
            entryName: `${file}/${index}`,
            contentBuffer: Buffer.from(EMPTY_PNG_BASE64, 'base64'),
        };
    }
}

import Extractor from '../../../extractor/Extractor';

export default class TestExtractor implements Extractor {
    async readEntryAt(file: string, index: number): Promise<Buffer> {
        return Buffer.from(`${file}/${index}`);
    }
}

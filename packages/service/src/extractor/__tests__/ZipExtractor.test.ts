import path from 'path';
import FileType from 'file-type';
import ZipExtractor from '../ZipExtractor';

const fixture = path.join(__dirname, 'fixtures', 'flat.zip');

test('read image', async () => {
    const extractor = new ZipExtractor();
    const buffer = await extractor.readEntryAt(fixture, 0);
    const fileType = await FileType.fromBuffer(buffer);
    expect(fileType?.ext).toBe('png');
    expect(fileType?.mime).toBe('image/png');
});

test('out of range', async () => {
    const extractor = new ZipExtractor();
    await expect(() => extractor.readEntryAt(fixture, 3)).rejects.toThrow();
    await expect(() => extractor.readEntryAt(fixture, -1)).rejects.toThrow();
});

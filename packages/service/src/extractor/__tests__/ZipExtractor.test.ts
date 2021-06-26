import path from 'path';
import FileType from 'file-type';
import ZipExtractor from '../ZipExtractor';

const fixture = path.join(__dirname, 'fixtures', 'nested.zip');

test('image sorted', async () => {
    const extractor = new ZipExtractor();
    const read = (index: number) => extractor.readEntryAt(fixture, index);
    const entries = await Promise.all([read(0), read(1), read(2)]);
    expect(entries[0].entryName).toBe('1.png');
    expect(entries[1].entryName).toBe('children/2.png');
    expect(entries[2].entryName).toBe('children/10.png');
});

test('read image', async () => {
    const extractor = new ZipExtractor();
    const entry = await extractor.readEntryAt(fixture, 0);
    const fileType = await FileType.fromBuffer(entry.contentBuffer);
    expect(fileType?.ext).toBe('png');
    expect(fileType?.mime).toBe('image/png');
});

test('out of range', async () => {
    const extractor = new ZipExtractor();
    await expect(() => extractor.readEntryAt(fixture, 3)).rejects.toThrow();
    await expect(() => extractor.readEntryAt(fixture, -1)).rejects.toThrow();
});

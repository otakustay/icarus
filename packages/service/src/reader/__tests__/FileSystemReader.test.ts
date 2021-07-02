import path from 'path';
import FileSystemReader from '../FileSystemReader';

const fixture = (name: string, extension = '.zip') => path.join(__dirname, 'fixtures', name + extension);

test('available pass zip', async () => {
    const reader = new FileSystemReader();
    const available = await reader.isLocationAvailable(fixture('empty'));
    expect(available).toBe(true);
});

test('available forbid non zip', async () => {
    const reader = new FileSystemReader();
    const available = await reader.isLocationAvailable(fixture('text', '.txt'));
    expect(available).toBe(false);
});

test('available lost', async () => {
    const reader = new FileSystemReader();
    const available = await reader.isLocationAvailable(fixture('none-exists'));
    expect(available).toBe(false);
});

test('list', async () => {
    const reader = new FileSystemReader();
    const list = await reader.readListAtLocation(path.join(__dirname, 'fixtures'));
    expect(list.length).toBe(3);
});

test('list none exists directory', async () => {
    const reader = new FileSystemReader();
    const list = await reader.readListAtLocation(path.join(__dirname, 'nowhere'));
    expect(list.length).toBe(0);
});

test('read empty', async () => {
    const reader = new FileSystemReader();
    const book = await reader.readBookInfo(fixture('empty'));
    expect(book.name).toBe('empty');
    expect(book.size).toBeGreaterThan(0);
    expect(book.createTime).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
    expect(book.imagesCount).toBe(0);
});

test('read flat', async () => {
    const reader = new FileSystemReader();
    const book = await reader.readBookInfo(fixture('flat'));
    expect(book.imagesCount).toBe(3);
});

test('read nested', async () => {
    const reader = new FileSystemReader();
    const book = await reader.readBookInfo(fixture('nested'));
    expect(book.imagesCount).toBe(3);
});

test('read none exists', async () => {
    const reader = new FileSystemReader();
    await expect(reader.readBookInfo(fixture('null'))).rejects.toThrow();
});

test('read unsupported', async () => {
    const reader = new FileSystemReader();
    await expect(reader.readBookInfo(fixture('text', '.txt'))).rejects.toThrow();
});

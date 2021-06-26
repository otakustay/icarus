import fs from 'fs';
import path from 'path';
import FilePersistence from '../FilePersistence';

const DATABSE_FILE = path.join(__dirname, 'fixtures', 'text.db');

class TestPersistence extends FilePersistence {
    constructor() {
        super(DATABSE_FILE);
    }
}

beforeEach(() => {
    fs.rmSync(DATABSE_FILE, {force: true});
});

test('open no file', async () => {
    const persistence = new TestPersistence();
    await persistence.open();
    const data = await persistence.read();
    expect(data).toBe('');
    await persistence.close();
});

test('open has file', async () => {
    fs.writeFileSync(DATABSE_FILE, '123');
    const persistence = new TestPersistence();
    await persistence.open();
    const data = await persistence.read();
    expect(data).toBe('123');
    await persistence.close();
});

test('write and read', async () => {
    const persistence = new TestPersistence();
    await persistence.open();
    await persistence.write('123');
    const data = await persistence.read();
    expect(data).toBe('123');
});

test('multiple write', async () => {
    const persistence = new TestPersistence();
    await persistence.open();
    await persistence.write('123');
    await persistence.write('2');
    const data = await persistence.read();
    expect(data).toBe('2');
    await persistence.close();
});

test('clear', async () => {
    const persistence = new TestPersistence();
    await persistence.open();
    await persistence.write('123');
    await persistence.clear();
    const data = await persistence.read();
    expect(data).toBe('');
    await persistence.close();
});

test('write on close', async () => {
    const persistence = new TestPersistence();
    await persistence.open();
    await persistence.write('123');
    await persistence.close();
    expect(fs.readFileSync(DATABSE_FILE, 'utf-8')).toBe('123');
});

test('throw when closed', async () => {
    const persistence = new TestPersistence();
    await expect(() => persistence.read()).rejects.toThrow();
    await expect(() => persistence.write('123')).rejects.toThrow();
    await expect(() => persistence.close()).rejects.toThrow();
});

import MemoryPersistence from '../MemoryPersistence';

test('empty value', async () => {
    const persistence = new MemoryPersistence();
    const data = await persistence.read();
    expect(data).toBe('');
});

test('default content', async () => {
    const persistence = new MemoryPersistence('123');
    const data = await persistence.read();
    expect(data).toBe('123');
});

test('write value', async () => {
    const persistence = new MemoryPersistence();
    await persistence.write('456');
    const data = await persistence.read();
    expect(data).toBe('456');
});

test('open', async () => {
    const persistence = new MemoryPersistence();
    await persistence.open();
});

test('close', async () => {
    const persistence = new MemoryPersistence();
    await persistence.close();
});

test('clear', async () => {
    const persistence = new MemoryPersistence();
    await persistence.write('456');
    await persistence.clear();
    const data = await persistence.read();
    expect(data).toBe('');
});

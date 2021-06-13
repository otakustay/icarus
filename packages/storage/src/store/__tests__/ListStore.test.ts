import MemoryPersistence from '../../persistence/MemoryPersistence';
import ListStore from '../ListStore';

test('size', async () => {
    const persistence = new MemoryPersistence('[1,2,3]');
    const store = new ListStore(persistence, new MemoryPersistence());
    const size = await store.size();
    expect(size).toBe(3);
});

test('insert', async () => {
    const persistence = new MemoryPersistence('[1,2,3]');
    const store = new ListStore<number>(persistence, new MemoryPersistence());
    await store.insert(4);
    const content = await persistence.read();
    expect(content).toBe('[1,2,3,4]');
});

test('at', async () => {
    const persistence = new MemoryPersistence('[1,2,3]');
    const store = new ListStore<number>(persistence, new MemoryPersistence());
    const value = await store.at(1);
    expect(value).toBe(2);
});

test('at negative', async () => {
    const persistence = new MemoryPersistence('[1,2,3]');
    const store = new ListStore<number>(persistence, new MemoryPersistence());
    expect(() => store.at(-1)).rejects.toThrow();
});

test('at out of bound', async () => {
    const persistence = new MemoryPersistence('[1,2,3]');
    const store = new ListStore<number>(persistence, new MemoryPersistence());
    expect(() => store.at(3)).rejects.toThrow();
});

test('find', async () => {
    const persistence = new MemoryPersistence('[{"x":1},{"x":2}]');
    const store = new ListStore<{x: number}>(persistence, new MemoryPersistence());
    const found = await store.find('x', 1);
    expect(found?.x).toBe(1);
    const notFound = await store.find('x', 3);
    expect(notFound).toBe(undefined);
});


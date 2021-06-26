import MemoryPersistence from '../../persistence/MemoryPersistence';
import Persistence from '../../persistence/Persistence';
import DefaultSerializer from '../../serializer/DefaultSerializer';
import BaseStore from '../BaseStore';

class TestStore extends BaseStore<number> {
    private readonly inMemory: Persistence;

    constructor(initialValue?: number) {
        const serializer = new DefaultSerializer();
        const initialInMemoryContent = typeof initialValue === 'number'
            ? serializer.serialize(initialValue)
            : undefined;
        const inMemory = new MemoryPersistence(initialInMemoryContent);
        super(0, inMemory, serializer);
        this.inMemory = inMemory;
    }
    increment() {
        return this.updateData(v => v + 1);
    }
    decrement() {
        return this.updateData(v => v - 1);
    }
    read() {
        return this.readData();
    }
    readPersisted() {
        return this.inMemory.read();
    }
}

test('open to default value', async () => {
    const store = new TestStore();
    await store.open();
    const data = await store.read();
    expect(data).toBe(0);
    await store.close();
});

test('open to restore value', async () => {
    const store = new TestStore(123);
    await store.open();
    const data = await store.read();
    expect(data).toBe(123);
    await store.close();
});

test('write on close', async () => {
    const store = new TestStore();
    await store.open();
    await store.close();
    const data = await store.readPersisted();
    expect(data).toBe('0');
});

test('read data', async () => {
    const store = new TestStore();
    await store.open();
    const data = await store.read();
    expect(data).toBe(0);
    await store.close();
});

test('throw when closed', async () => {
    const store = new TestStore();
    await expect(() => store.read()).rejects.toThrow();
    await expect(() => store.increment()).rejects.toThrow();
});

test('update value', async () => {
    const store = new TestStore();
    await store.open();
    await store.increment();
    const data = await store.read();
    expect(data).toBe(1);
    await store.close();
});

import MemoryPersistence from '../../persistence/MemoryPersistence';
import Persistence from '../../persistence/Persistence';
import DefaultSerializer from '../../serializer/DefaultSerializer';
import BaseStore, {transaction, batchTransaction} from '../BaseStore';

class TestStore extends BaseStore<number> {
    private readonly inMemory: Persistence;

    constructor(initialValue?: number) {
        const serializer = new DefaultSerializer();
        const initialInMemoryContent = typeof initialValue === 'number'
            ? serializer.serialize(initialValue)
            : undefined;
        const inMemory = new MemoryPersistence(initialInMemoryContent);
        super(
            0,
            inMemory,
            new MemoryPersistence(),
            serializer
        );
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
    expect(() => store.read()).rejects.toThrow();
    expect(() => store.increment()).rejects.toThrow();
    expect(() => store.beginTransaction()).rejects.toThrow();
});

test('update value', async () => {
    const store = new TestStore();
    await store.open();
    await store.increment();
    const data = await store.read();
    expect(data).toBe(1);
    await store.close();
});

test('in transaction', async () => {
    const store = new TestStore();
    await store.open();
    await store.beginTransaction();
    await store.increment();
    const data = await store.read();
    expect(data).toBe(1);
    await store.close();
});

test('commit transaction', async () => {
    const store = new TestStore();
    await store.open();
    await store.beginTransaction();
    await store.increment();
    await store.commitTransaction();
    const data = await store.read();
    expect(data).toBe(1);
    await store.close();
});

test('rollback transaction', async () => {
    const store = new TestStore();
    await store.open();
    await store.beginTransaction();
    await store.increment();
    await store.increment();
    await store.rollbackTransaction();
    const data = await store.read();
    expect(data).toBe(0);
    await store.close();
});

test('auto commit on close', async () => {
    const store = new TestStore();
    await store.open();
    await store.beginTransaction();
    await store.increment();
    await store.close();
    const data = await store.readPersisted();
    expect(data).toBe('1');
});

test('throw on multiple transaction', async () => {
    const store = new TestStore();
    await store.open();
    await store.beginTransaction();
    expect(() => store.beginTransaction()).rejects.toThrow();
    await store.close();
});

test('throw on commit with no transaction', async () => {
    const store = new TestStore();
    await store.open();
    expect(() => store.commitTransaction()).rejects.toThrow();
    await store.close();
});

test('throw on rollback with no transaction', async () => {
    const store = new TestStore();
    await store.open();
    expect(() => store.rollbackTransaction()).rejects.toThrow();
    await store.close();
});

test('transaction auto commit', async () => {
    const store = new TestStore();
    await store.open();
    await transaction(
        store,
        async () => {
            await store.increment();
            await store.increment();
        }
    );
    const data = await store.read();
    expect(data).toBe(2);
    await store.close();
});

test('transaction auto rollback', async () => {
    const store = new TestStore();
    await store.open();
    try {
        await transaction(
            store,
            async () => {
                await store.increment();
                await store.increment();
                throw new Error('test fail');
            }
        );
    }
    catch (ex) {
        expect(ex.message).toBe('test fail');
    }
    const data = await store.read();
    expect(data).toBe(0);
    await store.close();
});

test('batch transaction auto commit', async () => {
    const storeX = new TestStore();
    const storeY = new TestStore();
    await Promise.all([storeX.open(), storeY.open()]);
    await batchTransaction(
        [storeX, storeY],
        async () => {
            await Promise.all([storeX.increment(), storeY.increment()]);
            await storeY.increment();
        }
    );
    const dataX = await storeX.read();
    expect(dataX).toBe(1);
    const dataY = await storeY.read();
    expect(dataY).toBe(2);
    await Promise.all([storeX.close(), storeY.close()]);
});

test('batch transaction auto rollback', async () => {
    const storeX = new TestStore();
    const storeY = new TestStore();
    await Promise.all([storeX.open(), storeY.open()]);
    try {
        await batchTransaction(
            [storeX, storeY],
            async () => {
                await Promise.all([storeX.increment(), storeY.increment()]);
                await storeY.increment();
                throw new Error('test fail');
            }
        );
    }
    catch (ex) {
        expect(ex.message).toBe('test fail');
    }
    const dataX = await storeX.read();
    expect(dataX).toBe(0);
    const dataY = await storeY.read();
    expect(dataY).toBe(0);
    await Promise.all([storeX.close(), storeY.close()]);
});

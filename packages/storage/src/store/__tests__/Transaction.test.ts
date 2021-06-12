import Transaction from '../Transaction';
import MemoryPersistence from '../../persistence/MemoryPersistence';
import DefaultSerializer from '../../serializer/DefaultSerializer';

const newTransaction = () => {
    const persistence = new MemoryPersistence();
    const transaction = new Transaction<number>(persistence, new DefaultSerializer());
    return {persistence, transaction};
};

test('clear on open', async () => {
    const {transaction, persistence} = newTransaction();
    await persistence.write('123');
    await transaction.open();
    const content = await persistence.read();
    expect(content).toBe('');
});

test('clear on close', async () => {
    const {transaction, persistence} = newTransaction();
    await transaction.open();
    await transaction.begin(123);
    await transaction.close();
    const content = await persistence.read();
    expect(content).toBe('');
});

test('read in transaction', async () => {
    const {transaction} = newTransaction();
    await transaction.open();
    await transaction.begin(123);
    await transaction.saveSnapshot(456);
    const data = await transaction.readCurrent();
    expect(data).toBe(456);
});

test('read before open', async () => {
    const {transaction} = newTransaction();
    expect(() => transaction.readCurrent()).rejects.toThrow();
});

test('commit', async () => {
    const {transaction} = newTransaction();
    await transaction.open();
    await transaction.begin(123);
    await transaction.saveSnapshot(4);
    await transaction.saveSnapshot(5);
    const data = await transaction.commit();
    expect(data).toBe(5);
});


test('rollback', async () => {
    const {transaction} = newTransaction();
    await transaction.open();
    await transaction.begin(123);
    await transaction.saveSnapshot(4);
    await transaction.saveSnapshot(5);
    const data = await transaction.rollback();
    expect(data).toBe(123);
});

test('throw when no transaction', async () => {
    const {transaction} = newTransaction();
    await transaction.open();
    expect(() => transaction.commit()).rejects.toThrow();
    expect(() => transaction.rollback()).rejects.toThrow();
});

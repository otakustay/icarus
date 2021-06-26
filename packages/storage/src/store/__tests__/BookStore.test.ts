import MemoryPersistence from '../../persistence/MemoryPersistence';
import BookStore from '../BookStore';

const newStore = () => new BookStore(new MemoryPersistence());

test('save', async () => {
    const store = newStore();
    await store.open();
    await store.save({name: 'test', size: 0, imagesCount: 0, createTime: (new Date(2020, 0, 1)).toISOString()});
    await store.close();
});

test('find not existing', async () => {
    const store = newStore();
    await store.open();
    const book = await store.findByName('test');
    expect(book).toBe(null);
    await store.close();
});

test('save and find', async () => {
    const store = newStore();
    await store.open();
    await store.save({name: 'test', size: 0, imagesCount: 0, createTime: (new Date(2020, 0, 1)).toISOString()});
    const book = await store.findByName('test');
    expect(book?.size).toBe(0);
    expect(book?.imagesCount).toBe(0);
    await store.close();
});

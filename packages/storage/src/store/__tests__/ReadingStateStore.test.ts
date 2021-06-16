import {ReadingState} from '@icarus/shared';
import MemoryPersistence from '../../persistence/MemoryPersistence';
import ReadingStateStore from '../ReadingStateStore';

const TEST_STATE: ReadingState = {
    appVersion: '0.0.0',
    bookLocations: ['book1', 'book2'],
    cursor: {
        bookIndex: 0,
        imageIndex: 0,
    },
    filter: {
        tagNames: [],
    },
};

const newStore = () => new ReadingStateStore(
    new MemoryPersistence(JSON.stringify(TEST_STATE)),
    new MemoryPersistence()
);

const newStoreWithCursor = (bookIndex: number, imageIndex: number) => new ReadingStateStore(
    new MemoryPersistence(JSON.stringify({...TEST_STATE, cursor: {bookIndex, imageIndex}})),
    new MemoryPersistence()
);

test('reset locations', async () => {
    const store = newStoreWithCursor(1, 2);
    await store.open();
    await store.resetBookLocations(['new']);
    const state = await store.read();
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    expect(state.bookLocations).toEqual(['new']);
    await store.close();
});

test('apply filter', async () => {
    const store = newStore();
    await store.open();
    await store.applyFilter({tagNames: ['1', '2']});
    const state = await store.read();
    expect(state.filter.tagNames).toEqual(['1', '2']);
    await store.close();
});

test('next image', async () => {
    const store = newStoreWithCursor(0, 0);
    await store.open();
    await store.moveToNextImage();
    const state = await store.read();
    expect(state.cursor.imageIndex).toBe(1);
    await store.close();
});

test('previous image', async () => {
    const store = newStoreWithCursor(0, 2);
    await store.open();
    await store.moveToPreviousImage();
    const state = await store.read();
    expect(state.cursor.imageIndex).toBe(1);
    await store.close();
});

test('previous image at first', async () => {
    const store = newStoreWithCursor(0, 0);
    await store.open();
    expect(() => store.moveToPreviousImage()).rejects.toThrow();
    await store.close();
});

test('next book', async () => {
    const store = newStoreWithCursor(0, 0);
    await store.open();
    await store.moveToNextBook();
    const state = await store.read();
    expect(state.cursor.bookIndex).toBe(1);
    await store.close();
});

test('next book at last', async () => {
    const store = newStoreWithCursor(1, 0);
    await store.open();
    expect(() => store.moveToNextBook()).rejects.toThrow();
    await store.close();
});

test('previous book', async () => {
    const store = newStoreWithCursor(1, 0);
    await store.open();
    await store.moveToPreviousBook();
    const state = await store.read();
    expect(state.cursor.bookIndex).toBe(0);
    await store.close();
});

test('previous book at first', async () => {
    const store = newStoreWithCursor(0, 0);
    await store.open();
    expect(() => store.moveToPreviousBook()).rejects.toThrow();
    await store.close();
});

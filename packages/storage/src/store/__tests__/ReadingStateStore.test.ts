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

const newStore = () => new ReadingStateStore(new MemoryPersistence(JSON.stringify(TEST_STATE)));

const newStoreWithCursor = (bookIndex: number, imageIndex: number) => {
    const initialContent = JSON.stringify({...TEST_STATE, cursor: {bookIndex, imageIndex}});

    return new ReadingStateStore(new MemoryPersistence(initialContent));
};

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
    const store = newStoreWithCursor(1, 1);
    await store.open();
    await store.applyFilter({tagNames: ['1', '2']});
    const state = await store.read();
    expect(state.filter.tagNames).toEqual(['1', '2']);
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    await store.close();
});

test('move cursor', async () => {
    const store = newStore();
    await store.open();
    await store.moveCursor(1, 2);
    const state = await store.read();
    expect(state.cursor.bookIndex).toBe(1);
    expect(state.cursor.imageIndex).toBe(2);
    await store.close();
});

test('move cursor negative reject', async () => {
    const store = newStore();
    await store.open();
    await expect(() => store.moveCursor(-1, 1)).rejects.toThrow();
    await expect(() => store.moveCursor(1, -1)).rejects.toThrow();
    await store.close();
});

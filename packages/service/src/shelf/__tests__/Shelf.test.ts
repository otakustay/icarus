import Shelf from '../Shelf';
import BookStore from './mocks/BookStore';
import TagRelationStore from './mocks/TagRelationStore';
import ReadingStateStore from './mocks/ReadingStateStore';
import Reader from './mocks/Reader';
import Extractor from './mocks/Extractor';

const newShelf = () => {
    const bookStore = new BookStore();
    const tagRelationStore = new TagRelationStore();
    const readingStateStore = new ReadingStateStore();
    const reader = new Reader();
    const extractor = new Extractor();
    const shelf = new Shelf(bookStore, tagRelationStore, readingStateStore, reader, extractor);
    return {bookStore, tagRelationStore, readingStateStore, reader, extractor, shelf};
};

test('reset on open directory', async () => {
    const {shelf, readingStateStore} = newShelf();
    await readingStateStore.moveCursor(1, 1);
    await shelf.open();
    await shelf.openDirectory('/test');
    const state = await readingStateStore.read();
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    await shelf.close();
});

test('reset on open files', async () => {
    const {shelf, readingStateStore} = newShelf();
    await readingStateStore.moveCursor(1, 1);
    await shelf.open();
    await shelf.openBooks(['/test/book1', '/test/book2']);
    const state = await readingStateStore.read();
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    await shelf.close();
});

test('read book info from store', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip']);
    const currentBook = await shelf.readCurrentBook();
    expect(currentBook.imagesCount).toBe(3);
    expect(currentBook.size).toBe(12);
});

test('save to book store when not exists', async () => {
    const {shelf, bookStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book-null.zip']);
    const currentBook = await shelf.readCurrentBook();
    expect(currentBook.imagesCount).toBe(12);
    expect(currentBook.size).toBe(233);
    expect(bookStore.saved.length).toBe(1);
});

test('read image', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip']);
    const imageBuffer = await shelf.readCurrentImage();
    expect(imageBuffer.toString()).toBe('/test/book1.zip/0');
});

test('next image', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await shelf.moveImageForward();
    const imageBuffer = await shelf.readCurrentImage();
    expect(imageBuffer.toString()).toBe('/test/book1.zip/1');
});

test('next image to next book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(0, 2);
    await shelf.moveImageForward();
    const imageBuffer = await shelf.readCurrentImage();
    expect(imageBuffer.toString()).toBe('/test/book2.zip/0');
});

test('next image no more', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(1, 2);
    expect(() => shelf.moveImageForward()).rejects.toThrow();
});

test('previous image', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(0, 2);
    await shelf.moveImageBackward();
    const imageBuffer = await shelf.readCurrentImage();
    expect(imageBuffer.toString()).toBe('/test/book1.zip/1');
});

test('previous image to previous book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(1, 0);
    await shelf.moveImageBackward();
    const imageBuffer = await shelf.readCurrentImage();
    expect(imageBuffer.toString()).toBe('/test/book1.zip/2');
});

test('previous image no more', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    expect(() => shelf.moveImageBackward()).rejects.toThrow();
});

test('next book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(0, 1);
    await shelf.moveBookForward();
    const imageBuffer = await shelf.readCurrentImage();
    expect(imageBuffer.toString()).toBe('/test/book2.zip/0');
});

test('next book no more', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(1, 0);
    expect(() => shelf.moveBookForward()).rejects.toThrow();
});

test('previous book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(1, 2);
    await shelf.moveBookBackward();
    const imageBuffer = await shelf.readCurrentImage();
    expect(imageBuffer.toString()).toBe('/test/book1.zip/0');
});

test('previous book no more', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(0, 2);
    expect(() => shelf.moveBookBackward()).rejects.toThrow();
});

import DefaultShelf from '../DefaultShelf';
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
    const shelf = new DefaultShelf(bookStore, tagRelationStore, readingStateStore, reader, extractor);
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
    await shelf.openBooks(['/test/book1.zip', '/test/book2.zip']);
    const state = await readingStateStore.read();
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    await shelf.close();
});

test('read state', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    const {state} = await shelf.readCurrentContent();
    expect(state.activeBooksCount).toBe(2);
    expect(state.totalBooksCount).toBe(2);
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    expect(state.filter.tagNames.length).toBe(0);
});

test('read state no book', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks([]);
    const {state, book, image} = await shelf.readCurrentContent();
    expect(state.activeBooksCount).toBe(0);
    expect(state.totalBooksCount).toBe(0);
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    expect(book).toBe(null);
    expect(image).toBe(null);
});

test('read state no active book', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip']);
    await shelf.applyFilter({tagNames: ['tag1']});
    const {state, book, image} = await shelf.readCurrentContent();
    expect(state.activeBooksCount).toBe(0);
    expect(state.totalBooksCount).toBe(1);
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
    expect(book).toBe(null);
    expect(image).toBe(null);
});

test('filter tag', async () => {
    const {shelf, readingStateStore, tagRelationStore} = newShelf();
    await shelf.open();
    await tagRelationStore.attachTagToBook('book2', 'tag1');
    await shelf.openBooks(['/test/book1.zip', '/test/book2.zip']);
    await readingStateStore.applyFilter({tagNames: ['tag1']});
    const {state, book} = await shelf.readCurrentContent();
    expect(state.filter.tagNames).toEqual(['tag1']);
    expect(state.activeBooksCount).toBe(1);
    expect(state.totalBooksCount).toBe(2);
    expect(book?.name).toBe('book2');
    await shelf.close();
});

test('read book info from store', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip']);
    const {book: currentBook} = await shelf.readCurrentContent();
    expect(currentBook?.imagesCount).toBe(12);
    expect(currentBook?.size).toBe(233);
});

test('save to book store when not exists', async () => {
    const {shelf, bookStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book-null.zip']);
    const {book: currentBook} = await shelf.readCurrentContent();
    expect(currentBook?.imagesCount).toBe(12);
    expect(currentBook?.size).toBe(233);
    expect(bookStore.saved.length).toBe(1);
});

test('read out of range error', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip']);
    await readingStateStore.moveCursor(1, 0);
    await expect(() => shelf.readCurrentContent()).rejects.toThrow();
});

test('read lost book', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/text.txt']);
    const {book} = await shelf.readCurrentContent();
    expect(book).toBe(null);
});

test('read book error', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/error-null.zip']);
    const {book} = await shelf.readCurrentContent();
    expect(book).toBe(null);
});

test('read image', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip']);
    const {image} = await shelf.readCurrentContent();
    expect(image?.name).toBe('/test/book1.zip/0');
});

test('read image error', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/broken.zip']);
    const {image} = await shelf.readCurrentContent();
    expect(image).toBe(null);
});

test('next image', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await shelf.moveImageForward();
    const {image} = await shelf.readCurrentContent();
    expect(image?.name).toBe('/test/book1.zip/1');
});

test('next image to next book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip', '/test/book2.zip']);
    await readingStateStore.moveCursor(0, 11);
    await shelf.moveImageForward();
    const {image} = await shelf.readCurrentContent();
    expect(image?.name).toBe('/test/book2.zip/0');
});

test('next image current book error', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/error-null.zip', '/test/book1.zip']);
    await shelf.moveImageForward();
    const state = await readingStateStore.read();
    expect(state.cursor.bookIndex).toBe(1);
    expect(state.cursor.imageIndex).toBe(0);
});

test('next image to next errored book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip', '/test/error-null.zip']);
    await readingStateStore.moveCursor(0, 11);
    await shelf.moveImageForward();
    const state = await readingStateStore.read();
    expect(state.cursor.bookIndex).toBe(1);
    expect(state.cursor.imageIndex).toBe(0);
});

test('next image no more', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(1, 11);
    await expect(() => shelf.moveImageForward()).rejects.toThrow();
});

test('previous image', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(0, 2);
    await shelf.moveImageBackward();
    const {image} = await shelf.readCurrentContent();
    expect(image?.name).toBe('/test/book1.zip/1');
});

test('previous image to previous book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/book1.zip', '/test/book2.zip']);
    await readingStateStore.moveCursor(1, 0);
    await shelf.moveImageBackward();
    const {image} = await shelf.readCurrentContent();
    expect(image?.name).toBe('/test/book1.zip/11');
});

test('previous image to previous errored book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/error-null.zip', '/test/book1.zip']);
    await readingStateStore.moveCursor(1, 0);
    await shelf.moveImageBackward();
    const state = await readingStateStore.read();
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(0);
});

test('next previous image current book error', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openBooks(['/test/error.zip']);
    await readingStateStore.moveCursor(0, 3);
    await shelf.moveImageBackward();
    const state = await readingStateStore.read();
    expect(state.cursor.bookIndex).toBe(0);
    expect(state.cursor.imageIndex).toBe(2);
});

test('previous image no more', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await expect(() => shelf.moveImageBackward()).rejects.toThrow();
});

test('next book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(0, 1);
    await shelf.moveBookForward();
    const {image} = await shelf.readCurrentContent();
    expect(image?.name).toBe('/test/book2.zip/0');
});

test('next book no more', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(1, 0);
    await expect(() => shelf.moveBookForward()).rejects.toThrow();
});

test('previous book', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(1, 2);
    await shelf.moveBookBackward();
    const {image} = await shelf.readCurrentContent();
    expect(image?.name).toBe('/test/book1.zip/0');
});

test('previous book no more', async () => {
    const {shelf, readingStateStore} = newShelf();
    await shelf.open();
    await shelf.openDirectory('/test');
    await readingStateStore.moveCursor(0, 2);
    await expect(() => shelf.moveBookBackward()).rejects.toThrow();
});

test('list tags', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    const tagNames = await shelf.listTags();
    expect(tagNames).toEqual(['tag1', 'tag2', 'tag3']);
    await shelf.close();
});

test('suggest tags', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    const suggested = await shelf.suggestTags('book2', 5);
    expect(suggested).toEqual(['tag2']);
});

test('suggest tags trim', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    const suggested = await shelf.suggestTags('book2', 0);
    expect(suggested.length).toBe(0);
});

test('suggest tags book not found', async () => {
    const {shelf} = newShelf();
    await shelf.open();
    const suggested = await shelf.suggestTags('book4', 5);
    expect(suggested.length).toBe(0);
});

test('apply tag filter', async () => {
    const {shelf, tagRelationStore} = newShelf();
    await shelf.open();
    await tagRelationStore.attachTagToBook('book2', 'tag1');
    await shelf.openBooks(['/test/book1.zip', '/test/book2.zip']);
    await shelf.applyFilter({tagNames: ['tag1']});
    const {book} = await shelf.readCurrentContent();
    expect(book?.name).toBe('book2');
    await shelf.close();
});

test('remove tag filter', async () => {
    const {shelf, tagRelationStore, readingStateStore} = newShelf();
    await shelf.open();
    await tagRelationStore.attachTagToBook('book2', 'tag1');
    await shelf.openBooks(['/test/book1.zip', '/test/book2.zip']);
    await readingStateStore.applyFilter({tagNames: ['tag1']});
    await shelf.applyFilter({tagNames: []});
    const {book} = await shelf.readCurrentContent();
    expect(book?.name).toBe('book1');
    await shelf.close();
});

test('find tags', async () => {
    const {shelf, tagRelationStore} = newShelf();
    await shelf.open();
    await tagRelationStore.attachTagToBook('book1', 'tag1');
    await tagRelationStore.attachTagToBook('book1', 'tag2');
    const tagNames = await shelf.findTagsByBook('book1');
    expect(tagNames).toEqual(['tag1', 'tag2']);
    await shelf.close();
});

test('add tag to book', async () => {
    const {shelf, tagRelationStore} = newShelf();
    await shelf.open();
    await shelf.applyTagToBook('book1', 'tag1', true);
    const tagNames = await tagRelationStore.listTagsByBook('book1');
    expect(tagNames).toEqual(['tag1']);
    await shelf.close();
});

test('remove tag from book', async () => {
    const {shelf, tagRelationStore} = newShelf();
    await shelf.open();
    await tagRelationStore.attachTagToBook('book1', 'tag1');
    await shelf.applyTagToBook('book1', 'tag1', false);
    const tagNames = await tagRelationStore.listTagsByBook('book1');
    expect(tagNames.length).toBe(0);
    await shelf.close();
});

test('remove tag empty', async () => {
    const {shelf, tagRelationStore} = newShelf();
    await shelf.open();
    await shelf.applyTagToBook('book1', 'tag1', false);
    const tagNames = await tagRelationStore.listTagsByBook('book1');
    expect(tagNames.length).toBe(0);
    await shelf.close();
});

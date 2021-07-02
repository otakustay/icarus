import {TagRelation} from '@icarus/shared';
import MemoryPersistence from '../../persistence/MemoryPersistence';
import TagRelationStore from '../TagRelationStore';

const newStore = (defaultValue?: TagRelation[]) => {
    const initialContent = defaultValue && JSON.stringify(defaultValue);
    return new TagRelationStore(new MemoryPersistence(initialContent));
};

test('attach', async () => {
    const store = newStore();
    await store.open();
    await store.attachTagToBook('book1', 'tag1');
    const tagNames = await store.listTagsByBook('book1');
    expect(tagNames).toEqual(['tag1']);
    await store.close();
});

test('attach duplicate', async () => {
    const store = newStore([{tagName: 'tag1', bookName: 'book1'}]);
    await store.open();
    await store.attachTagToBook('book1', 'tag1');
    const tagNames = await store.listTagsByBook('book1');
    expect(tagNames).toEqual(['tag1']);
    await store.close();
});

test('detach non existing', async () => {
    const store = newStore();
    await store.open();
    await store.detachTagFromBook('book1', 'tag1');
    const tagNames = await store.listTagsByBook('book1');
    expect(tagNames.length).toBe(0);
    await store.close();
});

test('detach existing', async () => {
    const store = newStore([{tagName: 'tag1', bookName: 'book1'}]);
    await store.open();
    await store.detachTagFromBook('book1', 'tag1');
    const tagNames = await store.listTagsByBook('book1');
    expect(tagNames.length).toBe(0);
    await store.close();
});

test('list tags', async () => {
    const content = [
        {tagName: 'test1', bookName: 'test'},
        {tagName: 'test2', bookName: 'test'},
        {tagName: 'test2', bookName: 'test1'},
        {tagName: 'test3', bookName: 'test1'},
    ];
    const store = newStore(content);
    await store.open();
    const tagNames = await store.listAllTags();
    expect(tagNames).toEqual(['test1', 'test2', 'test3']);
    await store.close();
});

test('find books single tag', async () => {
    const relations: TagRelation[] = [
        {tagName: 'tag1', bookName: 'book1'},
        {tagName: 'tag1', bookName: 'book2'},
        {tagName: 'tag2', bookName: 'book1'},
    ];
    const store = newStore(relations);
    await store.open();
    const books = await store.listBooksByTags(['tag1']);
    expect(books.length).toBe(2);
    await store.close();
});

test('find books duplicate', async () => {
    const relations: TagRelation[] = [
        {tagName: 'tag1', bookName: 'book1'},
        {tagName: 'tag1', bookName: 'book2'},
        {tagName: 'tag2', bookName: 'book1'},
    ];
    const store = newStore(relations);
    await store.open();
    const books = await store.listBooksByTags(['tag1', 'tag2']);
    expect(books.length).toBe(2);
    await store.close();
});

test('find tags', async () => {
    const relations: TagRelation[] = [
        {tagName: 'tag1', bookName: 'book1'},
        {tagName: 'tag1', bookName: 'book2'},
        {tagName: 'tag2', bookName: 'book1'},
    ];
    const store = newStore(relations);
    await store.open();
    const books = await store.listTagsByBook('book1');
    expect(books.length).toBe(2);
    await store.close();
});

test('find tags no book', async () => {
    const relations: TagRelation[] = [
        {tagName: 'tag1', bookName: 'book1'},
        {tagName: 'tag1', bookName: 'book2'},
        {tagName: 'tag2', bookName: 'book1'},
    ];
    const store = newStore(relations);
    await store.open();
    const books = await store.listTagsByBook('book3');
    expect(books.length).toBe(0);
    await store.close();
});

test('matrix', async () => {
    const relations: TagRelation[] = [
        {tagName: 'tag1', bookName: 'book1'},
        {tagName: 'tag1', bookName: 'book2'},
        {tagName: 'tag2', bookName: 'book1'},
    ];
    const store = newStore(relations);
    await store.open();
    const {bookNames, tagNames, matrix} = await store.buildMatrix();
    expect(bookNames).toEqual(['book1', 'book2']);
    expect(tagNames).toEqual(['tag1', 'tag2']);
    const expectedMatrix = [
        [1, 1],
        [1, 0],
    ];
    expect(matrix).toEqual(expectedMatrix);
});

test('matrix empty', async () => {
    const store = newStore();
    await store.open();
    const {bookNames, tagNames, matrix} = await store.buildMatrix();
    expect(bookNames.length).toBe(0);
    expect(tagNames.length).toBe(0);
    expect(matrix.length).toBe(0);
});

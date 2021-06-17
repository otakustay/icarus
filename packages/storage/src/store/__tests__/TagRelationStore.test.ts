import {TagRelation} from 'packages/shared/dist';
import MemoryPersistence from '../../persistence/MemoryPersistence';
import TagRelationStore from '../TagRelationStore';

const newStore = (defaultValue?: TagRelation[]) => {
    const initialContent = defaultValue && JSON.stringify(defaultValue);
    return new TagRelationStore(new MemoryPersistence(initialContent));
};

test('attach', async () => {
    const store = newStore();
    await store.open();
    await store.attachTagToBook('test', 'test');
    await store.close();
});

test('detach non existing', async () => {
    const store = newStore();
    await store.open();
    await store.detachTagFromBook('test', 'test');
    await store.close();
});

test('detach existing', async () => {
    const store = newStore([{tagName: 'test', bookName: 'test'}]);
    await store.open();
    await store.detachTagFromBook('test', 'test');
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


import {TagRelation} from '@icarus/shared';
import {TagRelationStore} from '@icarus/storage';
import NullPersistence from './NullPersistence';

export default class TestTagRelationStore extends TagRelationStore {
    saved: TagRelation[] = [];

    constructor() {
        super(new NullPersistence());
    }

    async attachTagToBook(bookName: string, tagName: string): Promise<void> {
        this.saved.push({bookName, tagName});
    }

    async detachTagFromBook(bookName: string, tagName: string): Promise<void> {
        const index = this.saved.findIndex(v => v.bookName === bookName && v.tagName === tagName);
        this.saved.splice(index, 1);
    }

    async listAllTags(): Promise<string[]> {
        return ['tag1', 'tag2', 'tag3'];
    }

    async listTagsByBook(bookName: string): Promise<string[]> {
        return this.saved.filter(v => v.bookName === bookName).map(v => v.tagName);
    }

    async listBooksByTags(tagNames: string[]): Promise<string[]> {
        const bookNames = this.saved.filter(v => tagNames.includes(v.tagName)).map(v => v.bookName);
        return [...new Set(bookNames)];
    }
}

import {TagRelation} from '@icarus/shared';
import Persistence from '../persistence/Persistence';
import DefaultSerializer from '../serializer/DefaultSerializer';
import BaseStore from './BaseStore';

export default class TagRelationStore extends BaseStore<TagRelation[]> {
    constructor(persistence: Persistence) {
        super([], persistence, new DefaultSerializer());
    }

    async attachTagToBook(bookName: string, tagName: string): Promise<void> {
        await this.updateData(s => [...s, {bookName, tagName}]);
    }

    async detachTagFromBook(bookName: string, tagName: string): Promise<void> {
        await this.updateData(s => s.filter(v => v.bookName === bookName && v.tagName === tagName));
    }

    async listTagsByBook(bookName: string): Promise<string[]> {
        const list = await this.readData();
        const tagNames = list.filter(v => v.bookName === bookName).map(v => v.tagName);
        return tagNames;
    }

    async listBooksByTags(tagNames: string[]): Promise<string[]> {
        const list = await this.readData();
        const bookNames = list.filter(v => tagNames.includes(v.tagName)).map(v => v.bookName);
        return bookNames;
    }
}
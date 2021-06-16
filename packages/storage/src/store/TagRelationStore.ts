import {TagRelation} from '@icarus/shared';
import ListStore from './ListStore';

const equalWith = (bookName: string, tagName: string) => (item: TagRelation) => {
    return item.bookName === bookName && item.tagName === tagName;
};

export default class TagRelationStore extends ListStore<TagRelation> {
    async attachTagToBook(bookName: string, tagName: string) {
        await this.insert({bookName, tagName});
    }

    async detachTagFromBook(bookName: string, tagName: string) {
        await this.removeBy(equalWith(bookName, tagName));
    }

    async listTagsByBook(bookName: string) {
        const tags = await this.filter('bookName', bookName);
        return tags;
    }

    async listBooksByTags(tagNames: string[]) {
        const books = await this.filterIn('tagName', tagNames);
        return books;
    }
}

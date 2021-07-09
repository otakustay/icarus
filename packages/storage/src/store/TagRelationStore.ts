import {TagRelation, RelationMatrix} from '@icarus/shared';
import Persistence from '../persistence/Persistence';
import DefaultSerializer from '../serializer/DefaultSerializer';
import BaseStore from './BaseStore';

interface MatrixInternal {
    tagNames: Set<string>;
    bookNames: Set<string>;
    tagNamesByBookName: Record<string, Set<string>>;
}

interface MatrixContext {
    tagNames: string[];
    bookNames: string[];
    tagNamesByBookName: Record<string, Set<string>>;
}

const createMatrixContext = (list: TagRelation[]): MatrixContext => {
    const internal = list.reduce(
        (output, {bookName, tagName}) => {
            output.tagNames.add(tagName);
            output.bookNames.add(bookName);
            if (!output.tagNamesByBookName[bookName]) {
                output.tagNamesByBookName[bookName] = new Set();
            }
            output.tagNamesByBookName[bookName].add(tagName);
            return output;
        },
        {tagNames: new Set(), bookNames: new Set(), tagNamesByBookName: {}} as MatrixInternal
    );
    return {
        tagNames: [...internal.tagNames],
        bookNames: [...internal.bookNames],
        tagNamesByBookName: internal.tagNamesByBookName,
    };
};

export default class TagRelationStore extends BaseStore<TagRelation[]> {
    constructor(persistence: Persistence) {
        super([], persistence, new DefaultSerializer());
    }

    async attachTagToBook(bookName: string, tagName: string): Promise<void> {
        const tryAddRow = (state: TagRelation[]) => {
            if (state.find(v => v.bookName === bookName && v.tagName === tagName)) {
                return state;
            }

            return [...state, {bookName, tagName}];
        };
        await this.updateData(tryAddRow);
    }

    async detachTagFromBook(bookName: string, tagName: string): Promise<void> {
        await this.updateData(s => s.filter(v => !(v.bookName === bookName && v.tagName === tagName)));
    }

    async listAllTags(): Promise<string[]> {
        const list = await this.readData();
        return [...new Set(list.map(v => v.tagName))];
    }

    async listTagsByBook(bookName: string): Promise<string[]> {
        const list = await this.readData();
        const tagNames = list.filter(v => v.bookName === bookName).map(v => v.tagName);
        return tagNames;
    }

    async listBooksByTags(tagNames: string[]): Promise<string[]> {
        const list = await this.readData();
        const bookToTagHit = list.reduce(
            (bookToTagHit, {bookName, tagName}) => {
                if (tagNames.includes(tagName)) {
                    if (bookToTagHit[bookName]) {
                        bookToTagHit[bookName].tagHit++;
                    }
                    else {
                        bookToTagHit[bookName] = {bookName, tagHit: 1};
                    }
                }
                return bookToTagHit;
            },
            {} as Record<string, {bookName: string, tagHit: number}>
        );
        return Object.values(bookToTagHit).filter(v => v.tagHit >= tagNames.length).map(v => v.bookName);
    }

    async buildMatrix(): Promise<RelationMatrix> {
        const list = await this.readData();
        const {tagNames, bookNames, tagNamesByBookName} = createMatrixContext(list);
        const toMatrixRow = (bookName: string): number[] => {
            const tagNamesOfCurrentBook = tagNamesByBookName[bookName];
            return tagNames.map(v => (tagNamesOfCurrentBook.has(v) ? 1 : 0));
        };
        const matrix = bookNames.map(toMatrixRow);
        return {
            matrix,
            tagNames,
            bookNames,
        };
    }
}

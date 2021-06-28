import {Book} from '@icarus/shared';
import {BookStore} from '@icarus/storage';
import NullPersistence from './NullPersistence';

export default class TestBookStore extends BookStore {
    saved: Book[] = [];

    constructor() {
        super(new NullPersistence());
    }

    async save(book: Book): Promise<void> {
        this.saved.push(book);
    }

    async findByName(name: string): Promise<Book | null> {
        if (name.includes('-null')) {
            return null;
        }

        return {
            name,
            size: 233,
            imagesCount: 12,
            createTime: (new Date(2021, 0, 1)).toISOString(),
        };
    }
}

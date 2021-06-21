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
            size: 12,
            imagesCount: 3,
        };
    }
}

import {Book} from '@icarus/shared';
import ListStore from './ListStore';

export default class BookStore extends ListStore<Book> {
    save(book: Book): Promise<void> {
        return this.insert(book);
    }

    findByName(name: string): Promise<Book | undefined> {
        return this.find('name', name);
    }
}

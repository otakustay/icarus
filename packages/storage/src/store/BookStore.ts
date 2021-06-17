import * as R from 'ramda';
import {Book} from '@icarus/shared';
import Persistence from '../persistence/Persistence';
import DefaultSerializer from '../serializer/DefaultSerializer';
import BaseStore from './BaseStore';

class MapListSerializer extends DefaultSerializer {
    serialize(map: Record<string, Book>) {
        const values = Object.values(map);
        return super.serialize(values);
    }

    deserialize(content: string) {
        const values: Book[] = super.deserialize(content);
        return R.indexBy(v => v.name, values);
    }
}

export default class BookStore extends BaseStore<Record<string, Book | undefined>> {
    constructor(persistence: Persistence) {
        super({}, persistence, new MapListSerializer());
    }

    async save(book: Book): Promise<void> {
        await this.updateData(s => ({...s, [book.name]: book}));
    }

    async findByName(name: string): Promise<Book | null> {
        const map = await this.readData();
        return map[name] ?? null;
    }
}

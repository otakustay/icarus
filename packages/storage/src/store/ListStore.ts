import Persistence from '../persistence/Persistence';
import DefaultSerializer from '../serializer/DefaultSerializer';
import BaseStore from './BaseStore';

export default class ListStore<T> extends BaseStore<T[]> {
    constructor(persistence: Persistence, transactionPersistence: Persistence) {
        super([], persistence, transactionPersistence, new DefaultSerializer());
    }

    async insert(item: T) {
        await this.updateData(list => [...list, item]);
    }

    async size() {
        const list = await this.readData();
        return list.length;
    }

    async at(index: number) {
        if (index < 0) {
            throw new Error('index is negative');
        }

        const list = await this.readData();

        if (index >= list.length) {
            throw new Error('index out of bound');
        }

        return list[index];
    }

    async find<K extends keyof T>(property: K, value: T[K]) {
        const list = await this.readData();
        return list.find(v => v[property] === value);
    }
}

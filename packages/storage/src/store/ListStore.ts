import Persistence from '../persistence/Persistence';
import DefaultSerializer from '../serializer/DefaultSerializer';
import BaseStore from './BaseStore';

export default class ListStore<T> extends BaseStore<T[]> {
    constructor(persistence: Persistence) {
        super([], persistence, new DefaultSerializer());
    }

    protected async insert(item: T) {
        await this.updateData(list => [...list, item]);
    }

    protected async removeBy(predicate: (item: T) => boolean) {
        await this.updateData(list => list.filter(v => !predicate(v)));
    }

    protected async find<K extends keyof T>(property: K, value: T[K]) {
        const list = await this.readData();
        return list.find(v => v[property] === value);
    }

    protected async filter<K extends keyof T>(property: K, value: T[K]) {
        const list = await this.readData();
        return list.filter(v => v[property] === value);
    }

    protected async filterIn<K extends keyof T>(property: K, values: Array<T[K]>) {
        const list = await this.readData();
        const valuesSet = new Set(values);
        return list.filter(v => valuesSet.has(v[property]));
    }
}

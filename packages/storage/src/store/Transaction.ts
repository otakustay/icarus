import Persistence from '../persistence/Persistence';
import Serializer from '../serializer/Serializer';

export interface TransactionStore<T> {
    current: T;
    snapshot: T;
}

export default class Transaction<T> {
    private readonly persistence: Persistence;
    private readonly serializer: Serializer;

    constructor(persistence: Persistence, serializer: Serializer) {
        this.persistence = persistence;
        this.serializer = serializer;
    }

    async open() {
        await this.persistence.open();
        // 初始化时丢弃所有未完成的事务
        await this.persistence.clear();
    }

    async close() {
        // 关闭时抛弃所有未完成的事务
        await this.persistence.clear();
        await this.persistence.close();
    }

    async begin(value: T) {
        const store: TransactionStore<T> = {
            snapshot: value,
            current: value,
        };

        await this.writeCurrentStore(store);
    }

    async commit() {
        const store = await this.readCurrentStore();
        await this.persistence.clear();
        return store.current;
    }

    async rollback() {
        const store = await this.readCurrentStore();
        await this.persistence.clear();
        return store.snapshot;
    }

    async saveSnapshot(value: T) {
        const store = await this.readCurrentStore();
        await this.writeCurrentStore({...store, current: value});
    }

    async readCurrent(): Promise<T> {
        const store = await this.readCurrentStore();
        return store.current;
    }

    private async readCurrentStore(): Promise<TransactionStore<T>> {
        const content = await this.persistence.read();

        if (!content) {
            throw new Error('Not in transaction');
        }

        return this.serializer.deserialize(content);
    }

    private async writeCurrentStore(store: TransactionStore<T>): Promise<void> {
        const content = this.serializer.serialize(store);
        await this.persistence.write(content);
    }
}

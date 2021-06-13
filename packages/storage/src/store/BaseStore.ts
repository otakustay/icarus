import Persistence from '../persistence/Persistence';
import Serializer from '../serializer/Serializer';
import Transaction from './Transaction';

export default abstract class BaseStore<T> {
    private readonly persistence: Persistence;
    private readonly transactionPersistence: Persistence;
    private readonly defaultValue: T;
    private readonly serializer: Serializer;
    private transaction: Transaction<T> | null = null;

    constructor(
        defaultValue: T,
        persistence: Persistence,
        transactionPersistence: Persistence,
        serializer: Serializer
    ) {
        this.defaultValue = defaultValue;
        this.persistence = persistence;
        this.transactionPersistence = transactionPersistence;
        this.serializer = serializer;
    }

    async open(): Promise<void> {
        await this.persistence.open();
        const initialContent = await this.persistence.read();
        if (!initialContent) {
            await this.persistence.write(this.serializer.serialize(this.defaultValue));
        }
    }

    async close(): Promise<void> {
        if (this.transaction) {
            await this.commitTransaction();
        }

        await this.persistence.close();
    }

    async beginTransaction(): Promise<void> {
        if (this.transaction) {
            throw new Error('Previous transaction not committed or rollbacked');
        }

        const data = await this.readData();
        this.transaction = new Transaction(this.transactionPersistence, this.serializer);
        await this.transaction.open();
        await this.transaction.begin(data);
    }

    async commitTransaction(): Promise<void> {
        if (!this.transaction) {
            throw new Error('Not in transaction');
        }

        const data = await this.transaction.commit();
        await this.writeData(data);
        await this.transaction.close();
        this.transaction = null;
    }

    async rollbackTransaction(): Promise<void> {
        if (!this.transaction) {
            throw new Error('Not in transaction');
        }

        const data = await this.transaction.rollback();
        await this.writeData(data);
        await this.transaction.close();
        this.transaction = null;
    }

    protected async updateData(next: (current: T) => T): Promise<T> {
        const currentData = await this.readData();
        const nextData = next(currentData);

        if (this.transaction) {
            await this.transaction.saveSnapshot(nextData);
        }
        else {
            await this.writeData(nextData);
        }

        return nextData;
    }

    protected async readData(): Promise<T> {
        if (this.transaction) {
            return this.transaction.readCurrent();
        }

        const content = await this.persistence.read();

        if (!content) {
            throw new Error('Persisted data empty');
        }

        return this.serializer.deserialize(content);
    }

    private async writeData(data: T): Promise<void> {
        const content = this.serializer.serialize(data);
        await this.persistence.write(content);
    }
}

export const transaction = async (child: BaseStore<unknown>, task: () => Promise<void>) => {
    await child.beginTransaction();
    try {
        await task();
        await child.commitTransaction();
    }
    catch (ex) {
        await child.rollbackTransaction();
        throw ex;
    }
};

export const batchTransaction = async (children: Array<BaseStore<unknown>>, task: () => Promise<void>) => {
    await Promise.all(children.map(c => c.beginTransaction()));
    try {
        await task();
        await Promise.all(children.map(c => c.commitTransaction()));
    }
    catch (ex) {
        await Promise.all(children.map(c => c.rollbackTransaction()));
        throw ex;
    }
};

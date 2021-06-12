import {existsSync} from 'fs';
import fs, {FileHandle} from 'fs/promises';
import {runLatest} from '@icarus/shared';

export default abstract class FileStore<T> {
    private readonly filename: string;
    private readonly defaultValue: T;
    private readonly writeData: () => Promise<void>;
    private storedData: T | null = null;
    private fileHandle: FileHandle | null = null;
    private transactionSnapshot: T | null = null;

    constructor(filename: string, defaultValue: T) {
        this.filename = filename;
        this.defaultValue = defaultValue;
        const writeData = async () => {
            const data = this.getStoredData();
            await this.getFileHandle().write(JSON.stringify(data), 0);
        };
        this.writeData = runLatest(writeData);
    }

    async open(): Promise<void> {
        if (existsSync(this.filename)) {
            this.fileHandle = await fs.open(this.filename, 'r+');
            const content = await this.fileHandle.readFile('utf-8');
            this.storedData = JSON.parse(content);
        }
        else {
            this.fileHandle = await fs.open(this.filename, 'w+');
            this.storedData = this.defaultValue;
            await this.writeData();
            await this.fileHandle.sync();
        }
    }

    async close(): Promise<void> {
        if (this.transactionSnapshot !== null) {
            this.commitTransaction();
        }

        await this.writeData();
        await this.getFileHandle().close();
        this.fileHandle = null;
        this.storedData = null;
    }

    beginTransaction(): void {
        if (this.transactionSnapshot !== null) {
            throw new Error('Previous transaction not committed or rollbacked');
        }

        this.transactionSnapshot = this.getStoredData();
    }

    async commitTransaction(): Promise<void> {
        if (this.transactionSnapshot === null) {
            throw new Error('Not in transaction');
        }

        this.storedData = this.transactionSnapshot;
        this.transactionSnapshot = null;
        await this.writeData();
    }

    rollbackTransaction(): void {
        if (this.transactionSnapshot === null) {
            throw new Error('Not in transaction');
        }

        this.transactionSnapshot = null;
    }

    protected getCurrentData(): T {
        const data = this.transactionSnapshot ?? this.storedData;

        if (data === null) {
            throw new Error('FileStore is closed');
        }

        return data;
    }

    protected async updateData(next: (current: T) => T): Promise<void> {
        const currentData = this.getCurrentData();
        const nextData = next(currentData);
        if (this.transactionSnapshot === null) {
            this.storedData = nextData;
            await this.writeData();
        }
        else {
            this.transactionSnapshot = nextData;
        }
    }

    private getStoredData(): T {
        if (this.storedData === null) {
            throw new Error('FileStore is closed');
        }

        return this.storedData;
    }

    private getFileHandle(): FileHandle {
        /* istanbul ignore next */
        if (this.fileHandle === null) {
            throw new Error('FileStore is closed');
        }

        return this.fileHandle;
    }
}


export const transaction = async (child: FileStore<unknown>, task: () => Promise<void>) => {
    child.beginTransaction();
    try {
        await task();
        await child.commitTransaction();
    }
    catch (ex) {
        child.rollbackTransaction();
        throw ex;
    }
};

export const batchTransaction = async (children: Array<FileStore<unknown>>, task: () => Promise<void>) => {
    children.forEach(c => c.beginTransaction());
    try {
        await task();
        await Promise.all(children.map(c => c.commitTransaction()));
    }
    catch (ex) {
        children.forEach(c => c.rollbackTransaction());
        throw ex;
    }
};

/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import {Persistence} from '@icarus/storage';

export default class NullPersistence implements Persistence {
    async open(): Promise<void> {
    }

    async close(): Promise<void> {
    }

    async read(): Promise<string> {
        return '';
    }

    async write(content: string): Promise<void> {
    }

    async clear(): Promise<void> {
    }
}

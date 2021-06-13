import Persistence from './Persistence';

export default class MemoryCachedPersistence implements Persistence {
    private readonly next: Persistence;
    private cache: string | null = null;

    constructor(next: Persistence) {
        this.next = next;
    }

    async open() {
        await this.next.open();
    }

    async close() {
        await this.next.close();
        this.cache = null;
    }

    async read() {
        if (this.cache === null) {
            this.cache = await this.next.read();
        }

        return this.cache;
    }

    async write(content: string) {
        await this.next.write(content);
        this.cache = content;
    }

    async clear() {
        await this.next.clear();
        this.cache = null;
    }
}

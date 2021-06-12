import Persistence from './Persistence';

export default class MemoryPersistence implements Persistence {
    private content: string;

    constructor(defaultContent = '') {
        this.content = defaultContent;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async open() {
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async close() {
    }

    async read() {
        return this.content;
    }

    async write(content: string) {
        this.content = content;
    }

    async clear() {
        this.content = '';
    }
}

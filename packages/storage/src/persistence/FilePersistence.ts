import {existsSync} from 'fs';
import fs, {FileHandle} from 'fs/promises';
import Persistence from './Persistence';

export default class FilePersistence implements Persistence {
    private readonly filename: string;
    private fileHandle: FileHandle | null = null;

    constructor(filename: string) {
        this.filename = filename;
    }

    async open(): Promise<void> {
        if (existsSync(this.filename)) {
            this.fileHandle = await fs.open(this.filename, 'r+');
        }
        else {
            this.fileHandle = await fs.open(this.filename, 'w+');
        }
    }

    async close(): Promise<void> {
        await this.getFileHandle().sync();
        await this.getFileHandle().close();
        this.fileHandle = null;
    }

    async read() {
        const content = await this.getFileHandle().readFile('utf-8');
        return content;
    }

    async write(content: string) {
        const fileHandle = this.getFileHandle();
        await fileHandle.truncate();
        await fileHandle.write(content, 0);
    }

    async clear() {
        await this.getFileHandle().truncate();
    }

    private getFileHandle(): FileHandle {
        if (this.fileHandle === null) {
            throw new Error('FilePersistence is closed');
        }

        return this.fileHandle;
    }
}

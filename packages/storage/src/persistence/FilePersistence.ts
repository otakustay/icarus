import path from 'path';
import {existsSync} from 'fs';
import fs from 'fs/promises';
import Persistence from './Persistence';

export default class FilePersistence implements Persistence {
    private readonly filename: string;
    private opened = false;

    constructor(filename: string) {
        this.filename = filename;
    }

    async open(): Promise<void> {
        const directory = path.dirname(this.filename);

        if (!existsSync(directory)) {
            throw new Error(`Containing diretory ${directory} not exits`);
        }

        const handle = await fs.open(this.filename, 'a');
        await handle.close();
        this.opened = true;
    }

    async close(): Promise<void> {
        if (!this.opened) {
            throw new Error(`FilePersistence of ${this.filename} is closed`);
        }

        this.opened = false;
    }

    async read() {
        if (!this.opened) {
            throw new Error(`FilePersistence of ${this.filename} is closed`);
        }

        const content = await fs.readFile(this.filename, 'utf-8');
        return content;
    }

    async write(content: string) {
        if (!this.opened) {
            throw new Error(`FilePersistence of ${this.filename} is closed`);
        }

        await fs.writeFile(this.filename, content);
    }

    async clear() {
        await this.write('');
    }
}

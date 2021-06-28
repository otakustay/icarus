import path from 'path';
import {DefaultShelf, FileSystemReader, registerService, ZipExtractor} from '@icarus/service';
import {BookStore, FilePersistence, ReadingStateStore, TagRelationStore} from '@icarus/storage';
import BackendRegistry from './BackendRegistry';

const storage = (name: string) => path.join(__dirname, '..', 'storage', `${name}.json`);

export default class BackendService {
    readonly shelf = new DefaultShelf(
        new BookStore(new FilePersistence(storage('book'))),
        new TagRelationStore(new FilePersistence(storage('tag'))),
        new ReadingStateStore(new FilePersistence(storage('state'))),
        new FileSystemReader(),
        new ZipExtractor()
    );

    readonly registry = new BackendRegistry(this.shelf);

    async setup() {
        await this.shelf.open();
        registerService(this.registry);
        this.registry.get(
            '/content',
            async context => {
                const content = await context.shelf.readCurrentContent();
                await context.success(content);
            }
        );
    }

    async dispose() {
        await this.shelf.close();
    }
}

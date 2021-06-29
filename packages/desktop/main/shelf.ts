import path from 'path';
import {DefaultShelf, FileSystemReader, Shelf, ZipExtractor} from '@icarus/service';
import {BookStore, FilePersistence, TagRelationStore, ReadingStateStore} from '@icarus/storage';

interface Container {
    current: Shelf | null;
}

const shelf: Container = {current: null};

export const setup = async (storageDirectory: string) => {
    const storage = (name: string) => path.join(storageDirectory, `${name}.json`);

    shelf.current = new DefaultShelf(
        new BookStore(new FilePersistence(storage('book'))),
        new TagRelationStore(new FilePersistence(storage('tag'))),
        new ReadingStateStore(new FilePersistence(storage('state'))),
        new FileSystemReader(),
        new ZipExtractor()
    );
    await shelf.current.open();
};

export const currentShelf = () => {
    const value = shelf.current;

    if (!value) {
        throw new Error('Shelf not initialized');
    }

    return value;
};

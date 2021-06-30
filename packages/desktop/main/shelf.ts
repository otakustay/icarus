import path from 'path';
import {DefaultShelf, FileSystemReader, Shelf, ZipExtractor} from '@icarus/service';
import {
    BookStore,
    FilePersistence,
    MemoryCachedPersistence,
    TagRelationStore,
    ReadingStateStore,
} from '@icarus/storage';

interface Container {
    current: Shelf | null;
}

const shelf: Container = {current: null};

export interface ShelfSetupOptions {
    stateStorageDirectory: string;
    dataStorageDirectory: string;
}

export const setup = async (options: ShelfSetupOptions) => {
    const {stateStorageDirectory, dataStorageDirectory} = options;

    shelf.current = new DefaultShelf(
        new BookStore(
            new MemoryCachedPersistence(
                new FilePersistence(
                    path.join(dataStorageDirectory, 'book.json')
                )
            )
        ),
        new TagRelationStore(
            new MemoryCachedPersistence(
                new FilePersistence(
                    path.join(dataStorageDirectory, 'tag.json')
                )
            )
        ),
        new ReadingStateStore(
            new MemoryCachedPersistence(
                new FilePersistence(
                    path.join(stateStorageDirectory, 'state.json')
                )
            )
        ),
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

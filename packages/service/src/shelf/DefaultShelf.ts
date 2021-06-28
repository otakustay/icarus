import {Book, Image, ReadingContent, ReadingFilter, ReadingState, ShelfState} from '@icarus/shared';
import {BookStore, TagRelationStore, ReadingStateStore} from '@icarus/storage';
import ShelfReader from '../reader/ShelfReader';
import Extractor from '../extractor/Extractor';
import {extractName} from '../utils/path';
import {constructImageInfo} from '../utils/image';

interface ActiveReadingState extends ReadingState {
    originalBookLocations: string[];
}

export default class DefaultShelf {
    private readonly bookStore: BookStore;
    private readonly tagRelationStore: TagRelationStore;
    private readonly readingStateStore: ReadingStateStore;
    private readonly reader: ShelfReader;
    private readonly extractor: Extractor;

    constructor(
        bookStore: BookStore,
        tagRelationStore: TagRelationStore,
        readingStateStore: ReadingStateStore,
        reader: ShelfReader,
        extractor: Extractor
    ) {
        this.bookStore = bookStore;
        this.tagRelationStore = tagRelationStore;
        this.readingStateStore = readingStateStore;
        this.reader = reader;
        this.extractor = extractor;
    }

    async open(): Promise<void> {
        await Promise.all([this.bookStore.open(), this.tagRelationStore.open(), this.readingStateStore.open()]);
    }

    async close(): Promise<void> {
        await Promise.all([this.bookStore.close(), this.tagRelationStore.close(), this.readingStateStore.close()]);
    }

    async openDirectory(location: string): Promise<void> {
        const bookLocations = await this.reader.readListAtLocation(location);
        await this.openBooks(bookLocations);
    }

    async openBooks(bookLocations: string[]): Promise<void> {
        await this.readingStateStore.resetBookLocations(bookLocations);
    }

    async moveImageForward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readActiveReadingState();
        const move = async (bookIndex: number, imageIndex: number): Promise<void> => {
            const bookLocation = bookLocations[bookIndex];
            const currentBook = await this.readBookInfo(bookLocation);

            // 当前的本子里没有下一张图片了，换到下一本试试，这里可能`moveBookForward`就因为没有下一本而抛异常
            if (imageIndex >= currentBook.imagesCount) {
                await this.moveBookForward();
                const {cursor} = await this.readActiveReadingState();
                await move(cursor.bookIndex, 0);
                return;
            }

            // 试着读一下图片，能读出来就成功，不然再往后走
            try {
                await this.extractor.readEntryAt(bookLocation, imageIndex);
                await this.readingStateStore.moveCursor(bookIndex, imageIndex);
            }
            catch {
                await move(bookIndex, imageIndex + 1);
            }
        };
        await move(bookIndex, imageIndex + 1);
    }

    async moveImageBackward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readActiveReadingState();
        const move = async (bookIndex: number, imageIndex: number): Promise<void> => {
            const bookLocation = bookLocations[bookIndex];

            // 当前的本子里没有上一张图片了，换到上一本试试，这里可能`moveBookBackward`就因为没有上一本而抛异常
            if (imageIndex < 0) {
                await this.moveBookBackward();
                const {cursor} = await this.readActiveReadingState();
                const book = await this.readCurrentBook();
                await move(cursor.bookIndex, book.imagesCount - 1);
                return;
            }

            // 试着读一下图片，能读出来就成功，不然再往前走
            try {
                await this.extractor.readEntryAt(bookLocation, imageIndex);
                await this.readingStateStore.moveCursor(bookIndex, imageIndex);
            }
            catch {
                await move(bookIndex, imageIndex - 1);
            }
        };
        await move(bookIndex, imageIndex - 1);
    }

    async moveBookForward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex}} = await this.readActiveReadingState();
        const move = async (index: number): Promise<void> => {
            if (index < 0 || index >= bookLocations.length) {
                throw new Error(`Cannot move book forward to index ${index}`);
            }

            const location = bookLocations[index];
            try {
                await this.readBookInfo(location);
                await this.readingStateStore.moveCursor(index, 0);
            }
            catch {
                await move(index + 1);
            }
        };
        await move(bookIndex + 1);
    }

    async moveBookBackward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex}} = await this.readActiveReadingState();
        const move = async (index: number): Promise<void> => {
            if (index < 0 || index >= bookLocations.length) {
                throw new Error(`Cannot move book backward to index ${index}`);
            }

            const location = bookLocations[index];
            try {
                await this.readBookInfo(location);
                await this.readingStateStore.moveCursor(index, 0);
            }
            catch {
                await move(index - 1);
            }
        };
        await move(bookIndex - 1);
    }

    async moveCursor(bookIndex: number, imageIndex: number): Promise<void> {
        const throwBookIndexError = () => {
            throw new Error(`Cannot move to book at index ${bookIndex}`);
        };
        const throwImageIndexError = () => {
            throw new Error(`Cannot move to image at index ${imageIndex}`);
        };

        if (bookIndex < 0) {
            throwBookIndexError();
        }
        if (imageIndex < 0) {
            throwImageIndexError();
        }

        const {bookLocations} = await this.readActiveReadingState();

        if (bookIndex >= bookLocations.length) {
            throwBookIndexError();
        }

        const {imagesCount} = await this.readBookInfo(bookLocations[bookIndex]);

        if (imageIndex >= imagesCount) {
            throwImageIndexError();
        }

        await this.readingStateStore.moveCursor(bookIndex, imageIndex);
    }

    async applyFilter(filter: ReadingFilter): Promise<void> {
        await this.readingStateStore.applyFilter(filter);
    }

    async readCurrentContent(): Promise<ReadingContent> {
        // 因为有可能刚打开的时候就有本子或图片有问题，此时是没有一个“向前”或者“向后”的操作的，所以要读一下试试，不行往后走
        try {
            const parts = [this.readState(), this.readCurrentBook(), this.readCurrentImage()] as const;
            const [state, book, image] = await Promise.all(parts);
            return {state, book, image};
        }
        catch {
            await this.moveImageForward();
            return this.readCurrentContent();
        }
    }

    private async readCurrentBook(): Promise<Book> {
        const {bookLocations, cursor: {bookIndex}} = await this.readActiveReadingState();

        if (bookIndex < 0 || bookIndex >= bookLocations.length) {
            throw new Error('Current book index out of range');
        }

        const location = bookLocations[bookIndex];
        return this.readBookInfo(location);
    }

    private async readCurrentImage(): Promise<Image> {
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readActiveReadingState();
        const location = bookLocations[bookIndex];
        const content = await this.extractor.readEntryAt(location, imageIndex);
        return constructImageInfo(content.entryName, content.contentBuffer);
    }

    private async readState(): Promise<ShelfState> {
        const readingState = await this.readActiveReadingState();

        return {
            totalBooksCount: readingState.originalBookLocations.length,
            activeBooksCount: readingState.bookLocations.length,
            cursor: readingState.cursor,
            filter: readingState.filter,
        };
    }

    private async readBookInfo(location: string): Promise<Book> {
        const name = extractName(location);
        const infoInStore = await this.bookStore.findByName(name);

        if (infoInStore) {
            return infoInStore;
        }

        const info = await this.reader.readBookInfo(location);
        await this.bookStore.save(info);
        return info;
    }

    private async readActiveReadingState(): Promise<ActiveReadingState> {
        const readingState = await this.readingStateStore.read();

        if (!readingState.filter.tagNames.length) {
            return {...readingState, originalBookLocations: readingState.bookLocations};
        }

        const taggedBookNames = await this.tagRelationStore.listBooksByTags(readingState.filter.tagNames);
        const shouldInclude = new Set(taggedBookNames);
        const filteredBookLocations = readingState.bookLocations.filter(v => shouldInclude.has(extractName(v)));
        return {
            ...readingState,
            bookLocations: filteredBookLocations,
            originalBookLocations: readingState.bookLocations,
        };
    }
}

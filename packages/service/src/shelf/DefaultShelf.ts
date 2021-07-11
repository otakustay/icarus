import {Book, Image, ReadingContent, ReadingFilter, ReadingState, ShelfState} from '@icarus/shared';
import {BookStore, TagRelationStore, ReadingStateStore} from '@icarus/storage';
import ShelfReader from '../reader/ShelfReader';
import Extractor from '../extractor/Extractor';
import {extractName} from '../utils/path';
import {constructImageInfo} from '../utils/image';
import CollabrativeMatrix from './CollabrativeMatrix';

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
        const bookLocation = bookLocations[bookIndex];
        try {
            const currentBook = await this.readBookInfo(bookLocation);
            if (imageIndex < currentBook.imagesCount - 1) {
                await this.readingStateStore.moveCursor(bookIndex, imageIndex + 1);
            }
            else {
                throw new Error('No previosu image');
            }
        }
        catch {
            if (bookIndex < bookLocations.length - 1) {
                await this.readingStateStore.moveCursor(bookIndex + 1, 0);
            }
            else {
                throw new Error('No more image to read');
            }
        }
    }

    async moveImageBackward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readActiveReadingState();

        if (imageIndex > 0) {
            await this.readingStateStore.moveCursor(bookIndex, imageIndex - 1);
        }
        else if (bookIndex > 0) {
            const previousBookIndex = bookIndex - 1;
            const previousBookLoation = bookLocations[previousBookIndex];
            try {
                const previousBook = await this.readBookInfo(previousBookLoation);
                await this.readingStateStore.moveCursor(previousBookIndex, previousBook.imagesCount - 1);
            }
            catch {
                await this.readingStateStore.moveCursor(previousBookIndex, 0);
            }
        }
        else {
            throw new Error('No more image to read');
        }
    }

    async moveBookForward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex}} = await this.readActiveReadingState();
        const nextBookIndex = bookIndex + 1;

        if (nextBookIndex < 0 || nextBookIndex >= bookLocations.length) {
            throw new Error(`Cannot move to book at index ${nextBookIndex}`);
        }

        await this.readingStateStore.moveCursor(nextBookIndex, 0);
    }

    async moveBookBackward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex}} = await this.readActiveReadingState();
        const nextBookIndex = bookIndex - 1;

        if (nextBookIndex < 0 || nextBookIndex >= bookLocations.length) {
            throw new Error(`Cannot move to book at index ${nextBookIndex}`);
        }

        await this.readingStateStore.moveCursor(nextBookIndex, 0);
    }

    async moveCursor(bookIndex: number, imageIndex: number): Promise<void> {
        const {bookLocations} = await this.readActiveReadingState();

        if (bookIndex < 0 || bookIndex >= bookLocations.length) {
            throw new Error(`Cannot move to book at index ${bookIndex}`);
        }

        const bookLocation = bookLocations[bookIndex];
        const book = await this.readBookInfo(bookLocation);

        if (imageIndex < 0 || imageIndex >= book.imagesCount) {
            throw new Error(`Cannot move image at index ${imageIndex} inside ${extractName(bookLocation)}`);
        }

        await this.readingStateStore.moveCursor(bookIndex, imageIndex);
    }

    async applyFilter(filter: ReadingFilter): Promise<void> {
        await this.readingStateStore.applyFilter(filter);
    }

    async listBookNames(): Promise<string[]> {
        const {bookLocations} = await this.readActiveReadingState();
        return bookLocations.map(extractName);
    }

    async listTags(): Promise<string[]> {
        const tagNames = await this.tagRelationStore.listAllTags();
        return tagNames;
    }

    async suggestTags(bookName: string, maxCount: number): Promise<string[]> {
        const {tagNames, bookNames, matrix} = await this.tagRelationStore.buildMatrix();
        const bookIndex = bookNames.indexOf(bookName);

        if (bookIndex < 0) {
            return [];
        }

        const collabrativeMatrix = new CollabrativeMatrix(matrix);
        const ratings = collabrativeMatrix.filterByUser(bookIndex);
        return ratings.slice(0, maxCount).map(v => tagNames[v.item]);
    }

    async findTagsByBook(bookName: string): Promise<string[]> {
        const tagNames = await this.tagRelationStore.listTagsByBook(bookName);
        return tagNames;
    }

    async applyTagToBook(bookName: string, tagName: string, active: boolean): Promise<void> {
        if (active) {
            await this.tagRelationStore.attachTagToBook(bookName, tagName);
        }
        else {
            await this.tagRelationStore.detachTagFromBook(bookName, tagName);
        }
    }

    async readCurrentContent(): Promise<ReadingContent> {
        const parts = [this.readState(), this.readCurrentBook(), this.readCurrentImage()] as const;
        const [state, book, image] = await Promise.all(parts);
        return {state, book, image};
    }

    private async readCurrentBook(): Promise<Book | null> {
        const {bookLocations, cursor: {bookIndex}} = await this.readActiveReadingState();

        if (!bookLocations.length) {
            return null;
        }

        if (bookIndex < 0 || bookIndex >= bookLocations.length) {
            throw new Error('Current book index out of range');
        }

        const location = bookLocations[bookIndex];
        const isAvailable = await this.reader.isLocationAvailable(location);

        if (!isAvailable) {
            return null;
        }

        try {
            const book = await this.readBookInfo(location);
            return book;
        }
        catch {
            return null;
        }
    }

    private async readCurrentImage(): Promise<Image | null> {
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readActiveReadingState();

        if (!bookLocations.length) {
            return null;
        }

        const location = bookLocations[bookIndex];
        try {
            const content = await this.extractor.readEntryAt(location, imageIndex);
            return constructImageInfo(content.entryName, content.contentBuffer);
        }
        catch {
            return null;
        }
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
        // 空的本子往往是解压没处理好，保存到数据库里会导致修复压缩包以后还是打不开，所以先不存
        if (info.imagesCount) {
            await this.bookStore.save(info);
        }
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

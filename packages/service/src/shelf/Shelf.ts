import path from 'path';
import {Book} from '@icarus/shared';
import {BookStore, TagRelationStore, ReadingStateStore} from '@icarus/storage';
import ShelfReader from '../reader/ShelfReader';
import Extractor from '../extractor/Extractor';

export default class Shelf {
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
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readingStateStore.read();
        const currentBook = await this.readBookInfo(bookLocations[bookIndex]);
        // 还有下一张
        if (imageIndex < currentBook.imagesCount - 1) {
            await this.readingStateStore.moveCursor(bookIndex, imageIndex + 1);
        }
        // 没有下一张，换到下一本
        else if (bookIndex < bookLocations.length - 1) {
            await this.readingStateStore.moveCursor(bookIndex + 1, 0);
        }
        // 没有下一本
        else {
            throw new Error('Cannot move image forward');
        }
    }

    async moveImageBackward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readingStateStore.read();
        // 有上一张
        if (imageIndex > 0) {
            await this.readingStateStore.moveCursor(bookIndex, imageIndex - 1);
        }
        // 没有上一张，换到上一本，要留在最后一页
        else if (bookIndex > 0) {
            const previousBook = await this.readBookInfo(bookLocations[bookIndex - 1]);
            await this.readingStateStore.moveCursor(bookIndex - 1, previousBook.imagesCount - 1);
        }
        // 没有上一本
        else {
            throw new Error('Cannot move image backward');
        }
    }

    async moveBookForward(): Promise<void> {
        const {bookLocations, cursor: {bookIndex}} = await this.readingStateStore.read();
        // 有下一本
        if (bookIndex < bookLocations.length - 1) {
            await this.readingStateStore.moveCursor(bookIndex + 1, 0);
        }
        // 没有下一本
        else {
            throw new Error('Cannot move book forward');
        }
    }

    async moveBookBackward(): Promise<void> {
        const {cursor: {bookIndex}} = await this.readingStateStore.read();
        // 有上一本
        if (bookIndex > 0) {
            await this.readingStateStore.moveCursor(bookIndex - 1, 0);
        }
        // 没有上一本
        else {
            throw new Error('Cannot move book backward');
        }
    }

    async readCurrentBook(): Promise<Book> {
        const {bookLocations, cursor: {bookIndex}} = await this.readingStateStore.read();
        const location = bookLocations[bookIndex];
        return this.readBookInfo(location);
    }

    async readCurrentImage(): Promise<Buffer> {
        const {bookLocations, cursor: {bookIndex, imageIndex}} = await this.readingStateStore.read();
        const location = bookLocations[bookIndex];
        const content = await this.extractor.readEntryAt(location, imageIndex);
        return content;
    }

    private async readBookInfo(location: string): Promise<Book> {
        const name = path.basename(location, path.extname(location));
        const infoInStore = await this.bookStore.findByName(name);

        if (infoInStore) {
            return infoInStore;
        }

        const info = await this.reader.readBookInfo(location);
        await this.bookStore.save(info);
        return info;
    }
}

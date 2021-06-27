import {ReadingFilter, Book, Image, ShelfState, ReadingCursor} from '@icarus/shared';
import {OpenByBooksBody, OpenByDirectoryBody, OpenByRestoreBody} from '../../index';
import Shelf from '../../../shelf/Shelf';

export default class TestShelf implements Shelf {
    opened: OpenByBooksBody | OpenByDirectoryBody | OpenByRestoreBody = {type: 'restore'};

    cursor: ReadingCursor = {bookIndex: 0, imageIndex: 0};

    filter: ReadingFilter = {tagNames: []};

    async open(): Promise<void> {
        // Empty
    }

    async close(): Promise<void> {
        // Empty
    }

    async openDirectory(location: string): Promise<void> {
        this.opened = {location, type: 'directory'};
    }

    async openBooks(bookLocations: string[]): Promise<void> {
        this.opened = {type: 'books', locations: bookLocations};
    }

    async moveImageForward(): Promise<void> {
        this.cursor.imageIndex++;
    }

    async moveImageBackward(): Promise<void> {
        this.cursor.imageIndex--;
    }

    async moveBookForward(): Promise<void> {
        this.cursor.bookIndex++;
    }

    async moveBookBackward(): Promise<void> {
        this.cursor.bookIndex--;
    }

    async moveCursor(bookIndex: number, imageIndex: number): Promise<void> {
        this.cursor.bookIndex = bookIndex;
        this.cursor.imageIndex = imageIndex;
    }

    async applyFilter(filter: ReadingFilter): Promise<void> {
        this.filter = filter;
    }

    async readCurrentBook(): Promise<Book> {
        if (this.opened.type === 'directory' && this.opened.location === '/error') {
            throw new Error('Out of range');
        }

        return {
            name: 'book',
            imagesCount: 3,
            size: 233,
            createTime: (new Date(2021, 0, 1)).toISOString(),
        };
    }

    async readCurrentImage(): Promise<Image> {
        return {
            name: 'image',
            width: 1,
            height: 1,
            content: 'image',
        };
    }

    async readState(): Promise<ShelfState> {
        return {
            totalBooksCount: 3,
            activeBooksCount: 1,
            cursor: this.cursor,
            filter: this.filter,
        };
    }


}

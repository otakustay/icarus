import {ReadingFilter, Book, Image, ShelfState, ReadingCursor, ReadingContent} from '@icarus/shared';
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
        if (this.cursor.imageIndex <= 0) {
            throw new Error('Image index out of range');
        }

        this.cursor.imageIndex--;
    }

    async moveBookForward(): Promise<void> {
        this.cursor.bookIndex++;
    }

    async moveBookBackward(): Promise<void> {
        if (this.cursor.bookIndex <= 0) {
            throw new Error('Book index out of range');
        }

        this.cursor.bookIndex--;
    }

    async applyFilter(filter: ReadingFilter): Promise<void> {
        this.filter = filter;
    }

    async listTags(): Promise<string[]> {
        return ['tag1', 'tag2', 'tag3'];
    }

    async findTagsByBook(bookName: string): Promise<string[]> {
        if (bookName.includes('error')) {
            throw new Error('Unable to open tag store');
        }

        return [`${bookName}:tag1`, `${bookName}:tag2`];
    }

    async applyTagToBook(bookName: string, tagName: string, active: boolean): Promise<void> {
        if (tagName.includes('error')) {
            throw new Error(`Failed to apply tag ${tagName} to book ${bookName} as ${active}`);
        }
    }

    async readCurrentContent(): Promise<ReadingContent> {
        const parts = [this.readState(), this.readCurrentBook(), this.readCurrentImage()] as const;
        const [state, book, image] = await Promise.all(parts);
        return {state, book, image};
    }

    async moveCursor(bookIndex: number, imageIndex: number): Promise<void> {
        this.cursor.bookIndex = bookIndex;
        this.cursor.imageIndex = imageIndex;
    }

    private async readCurrentBook(): Promise<Book> {
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

    private async readCurrentImage(): Promise<Image> {
        return {
            name: 'image',
            width: 1,
            height: 1,
            content: 'image',
        };
    }

    private async readState(): Promise<ShelfState> {
        return {
            totalBooksCount: 3,
            activeBooksCount: 1,
            cursor: this.cursor,
            filter: this.filter,
        };
    }


}

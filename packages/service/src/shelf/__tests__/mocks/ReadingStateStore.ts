import {ReadingFilter, ReadingState} from '@icarus/shared';
import {ReadingStateStore} from '@icarus/storage';
import NullPersistence from './NullPersistence';

export default class TestBookStore extends ReadingStateStore {
    saved: ReadingState = {
        appVersion: '0.0.1',
        bookLocations: [],
        cursor: {bookIndex: 0, imageIndex: 0},
        filter: {tagNames: []},
    };

    constructor() {
        super(new NullPersistence());
    }

    async read(): Promise<ReadingState> {
        return this.saved;
    }

    async resetBookLocations(bookLocations: string[]): Promise<void> {
        this.saved = {
            ...this.saved,
            bookLocations,
            cursor: {bookIndex: 0, imageIndex: 0},
            filter: {tagNames: []},
        };
    }

    async applyFilter(filter: ReadingFilter): Promise<void> {
        this.saved.filter = filter;
    }

    async moveCursor(bookIndex: number, imageIndex: number): Promise<void> {
        this.saved.cursor = {bookIndex, imageIndex};
    }
}

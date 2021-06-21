import {ReadingFilter, ReadingState} from '@icarus/shared';
import Persistence from '../persistence/Persistence';
import DefaultSerializer from '../serializer/DefaultSerializer';
import BaseStore from './BaseStore';

const DEFAULT_STATE: ReadingState = {
    appVersion: '0.0.0',
    bookLocations: [],
    cursor: {
        bookIndex: 0,
        imageIndex: 0,
    },
    filter: {
        tagNames: [],
    },
};

export default class ReadingStateStore extends BaseStore<ReadingState> {
    constructor(persistence: Persistence) {
        super(DEFAULT_STATE, persistence, new DefaultSerializer());
    }

    read(): Promise<ReadingState> {
        return this.readData();
    }

    async resetBookLocations(bookLocations: string[]): Promise<void> {
        await this.updateData(() => ({...DEFAULT_STATE, bookLocations}));
    }

    async applyFilter(filter: ReadingFilter): Promise<void> {
        await this.updateData(s => ({...s, filter}));
    }

    async moveCursor(bookIndex: number, imageIndex: number) {
        if (bookIndex < 0) {
            throw new Error('bookIndex cannot be negative');
        }

        if (imageIndex < 0) {
            throw new Error('imageIndex cannot be negative');
        }

        await this.updateData(s => ({...s, cursor: {bookIndex, imageIndex}}));
    }
}

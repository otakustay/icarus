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

const reducers = {
    moveToNextImage: (state: ReadingState): ReadingState => {
        return {
            ...state,
            cursor: {
                ...state.cursor,
                imageIndex: state.cursor.imageIndex + 1,
            },
        };
    },
    moveToPreviousImage: (state: ReadingState): ReadingState => {
        if (state.cursor.imageIndex <= 0) {
            throw new Error('Already at the first image');
        }

        return {
            ...state,
            cursor: {
                ...state.cursor,
                imageIndex: state.cursor.imageIndex - 1,
            },
        };
    },
    moveToNextBook: (state: ReadingState): ReadingState => {
        if (state.cursor.bookIndex >= state.bookLocations.length - 1) {
            throw new Error('Already at the last book');
        }

        return {
            ...state,
            cursor: {
                ...state.cursor,
                bookIndex: state.cursor.bookIndex + 1,
            },
        };
    },
    moveToPreviousBook: (state: ReadingState): ReadingState => {
        if (state.cursor.bookIndex <= 0) {
            throw new Error('Already at the first book');
        }

        return {
            ...state,
            cursor: {
                ...state.cursor,
                bookIndex: state.cursor.bookIndex - 1,
            },
        };
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

    async moveToNextImage(): Promise<void> {
        await this.updateData(reducers.moveToNextImage);
    }
    async moveToPreviousImage(): Promise<void> {
        await this.updateData(reducers.moveToPreviousImage);
    }

    async moveToNextBook(): Promise<void> {
        await this.updateData(reducers.moveToNextBook);
    }

    async moveToPreviousBook(): Promise<void> {
        await this.updateData(reducers.moveToPreviousBook);
    }

}

import {Book, Image, ReadingFilter, ReadingState, ShelfState} from '@icarus/shared';

export interface ActiveReadingState extends ReadingState {
    originalBookLocations: string[];
}

export default interface Shelf {
    open(): Promise<void>;
    close(): Promise<void>;
    openDirectory(location: string): Promise<void>;
    openBooks(bookLocations: string[]): Promise<void>;
    moveImageForward(): Promise<void>;
    moveImageBackward(): Promise<void>;
    moveBookForward(): Promise<void>;
    moveBookBackward(): Promise<void>;
    moveCursor(bookIndex: number, imageIndex: number): Promise<void>;
    applyFilter(filter: ReadingFilter): Promise<void>;
    readCurrentBook(): Promise<Book>;
    readCurrentImage(): Promise<Image>;
    readState(): Promise<ShelfState>;
}

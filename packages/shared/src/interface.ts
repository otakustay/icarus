export interface Shelf {
    booksCount: number;
}

export interface ReadingCursor {
    bookIndex: number;
    imageIndex: number;
}

export interface ReadingFilter {
    tagNames: string[];
}

export interface ReadingState {
    appVersion: string;
    bookLocations: string[];
    cursor: ReadingCursor;
    filter: ReadingFilter;
}

export interface ShelfState {
    totalBooksCount: number;
    activeBooksCount: number;
    cursor: ReadingCursor;
    filter: ReadingFilter;
}

export interface Book {
    name: string;
    size: number;
    imagesCount: number;
    createTime: string;
}

export interface Image {
    name: string;
    width: number;
    height: number;
    content: string;
}

export interface TagRelation {
    bookName: string;
    tagName: string;
}

export interface Size {
    width: number;
    height: number;
}

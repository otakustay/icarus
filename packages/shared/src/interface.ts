export interface Shelf {
    booksCount: number;
}

export interface ReadingCursur {
    bookIndex: number;
    imageIndex: number;
}

export interface ReadingFilter {
    tagNames: string[];
}

export interface ReadingState {
    appVersion: string;
    bookLocations: string[];
    cursor: ReadingCursur;
    filter: ReadingFilter;
}

export interface ShelfState {
    totalBooksCount: number;
    activeBooksCount: number;
    cursor: ReadingCursur;
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

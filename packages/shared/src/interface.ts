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

export interface Book {
    name: string;
    size: number;
    imagesCount: number;
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

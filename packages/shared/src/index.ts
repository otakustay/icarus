export interface Shelf {
    booksCount: number;
}

export interface Book {
    name: string;
    imagesCount: number;
}

export interface Image {
    name: string;
    width: number;
    height: number;
    content: string;
}

export interface Tag {
    name: string;
}

export * from './function';

import {Book} from '@icarus/shared';

export default interface ShelfReader {
    readListAtLocation(location: string): Promise<string[]>;
    readBookInfo(location: string): Promise<Book>;
}

import {Book} from '@icarus/shared';

export default interface ShelfReader {
    isLocationAvailable(location: string): Promise<boolean>;
    readListAtLocation(location: string): Promise<string[]>;
    readBookInfo(location: string): Promise<Book>;
}

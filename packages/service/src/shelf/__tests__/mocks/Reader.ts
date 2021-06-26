import path from 'path';
import {Book} from '@icarus/shared';
import ShelfReader from '../../../reader/ShelfReader';

export default class TestReader implements ShelfReader {
    async readListAtLocation(location: string): Promise<string[]> {
        return [`${location}/book1.zip`, `${location}/book2.zip`];
    }

    async readBookInfo(location: string): Promise<Book> {
        return {
            name: path.basename(location, path.extname(location)),
            size: 233,
            imagesCount: 12,
            createTime: (new Date(2021, 0, 1)).toISOString(),
        };
    }
}

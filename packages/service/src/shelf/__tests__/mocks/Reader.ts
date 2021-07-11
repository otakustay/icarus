import path from 'path';
import {Book} from '@icarus/shared';
import ShelfReader from '../../../reader/ShelfReader';

export default class TestReader implements ShelfReader {
    async isLocationAvailable(location: string): Promise<boolean> {
        return location.endsWith('.zip');
    }

    async readListAtLocation(location: string): Promise<string[]> {
        return [`${location}/book1.zip`, `${location}/book2.zip`];
    }

    async readBookInfo(location: string): Promise<Book> {
        if (location.includes('error')) {
            throw new Error(`Error extract file ${location}`);
        }

        return {
            name: path.basename(location, path.extname(location)),
            size: 233,
            imagesCount: location.includes('empty') ? 0 : 12,
            createTime: (new Date(2021, 0, 1)).toISOString(),
        };
    }
}

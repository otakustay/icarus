import path from 'path';
import fs from 'fs/promises';
import globby from 'globby';
import Zip from 'adm-zip';
import {Book} from '@icarus/shared';
import {isBookExtension} from '../utils/book';
import {extractName} from '../utils/path';
import {isImageExtension} from '../utils/image';
import ShelfReader from './ShelfReader';

export default class FileSystemReader implements ShelfReader {
    async readListAtLocation(location: string): Promise<string[]> {
        const list = await globby(`${location}/*.zip`);
        return list;
    }

    async readBookInfo(location: string): Promise<Book> {
        const extension = path.extname(location);

        if (!isBookExtension(extension)) {
            throw new Error(`Unsupported file type ${extension}`);
        }

        const [stat, contentBuffer] = await Promise.all([fs.stat(location), fs.readFile(location)]);
        const zip = new Zip(contentBuffer);
        const images = zip.getEntries().filter(e => isImageExtension(path.extname(e.entryName)));
        return {
            name: extractName(location),
            size: stat.size,
            imagesCount: images.length,
            createTime: stat.ctime.toISOString(),
        };
    }
}
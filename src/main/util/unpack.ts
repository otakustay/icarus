import path from 'path';
import {Archive} from '../../types';
import ZipArchive from './ZipArchive';
import RarArchive from './RarArchive';

export default (file: string): Promise<Archive> => {
    switch (path.extname(file)) {
        case '.zip':
            return ZipArchive.create(file);
        case '.rar':
            return RarArchive.create(file);
        default:
            throw new Error('Not supported');
    }
};

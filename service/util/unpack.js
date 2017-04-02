import path from 'path';
import ZipArchive from './ZipArchive';
import RarArchive from './RarArchive';

export default async file => {
    switch (path.extname(file)) {
        case '.zip':
            return ZipArchive.create(file);
        case '.rar':
            return RarArchive.create(file);
        default:
            throw new Error('Not supported');
    }
};

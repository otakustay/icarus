import * as path from 'path';
import * as naturalCompare from 'string-natural-compare';
import {Archive, ArchiveEntry} from '../../types';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp']);
const BLACKLIST = ['__MACOSX'];

export default class BaseArchive implements Archive {

    private archiveEntries: ArchiveEntry[] = [];

    static empty() {
        const archive = new BaseArchive();
        archive.entries = [];
        return archive;
    }

    get entries(): ArchiveEntry[] {
        return this.archiveEntries;
    }

    set entries(list: ArchiveEntry[]) {
        this.archiveEntries = list
            .filter(entry => !BLACKLIST.some(word => entry.entryName.includes(word)))
            .filter(entry => IMAGE_EXTENSIONS.has(path.extname(entry.name)))
            .sort((x, y) => naturalCompare.caseInsensitive(x.entryName, y.entryName));
    }

    readEntry(): Promise<Buffer> {
        throw new Error('Not implement');
    }
}

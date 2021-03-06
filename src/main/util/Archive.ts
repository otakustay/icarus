import * as path from 'path';
import naturalCompare from 'string-natural-compare';
import {Archive, ArchiveEntry} from '../../interface';

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
            .filter(entry => IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
            .sort((x, y) => naturalCompare(x.entryName, y.entryName, {caseInsensitive: true}));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readEntry(entry: ArchiveEntry): Promise<Buffer> {
        throw new Error('Not implement');
    }
}

import LinkedList from '../common/LinkedList';
import {IPCQueue, Storage, AppContext, ArchiveEntry, AppState, ArchiveBrowsingOptions} from '../types';
import {getLogger} from './util/logger';
import {Archive} from './util';

const logger = getLogger('context');

export default class GlobalContext implements AppContext {

    readonly ipc: IPCQueue;

    readonly storage: Storage;

    readonly version: string;

    archiveList: LinkedList<string> = new LinkedList<string>([]);

    browsingArchive: Archive = Archive.empty();

    imageList: LinkedList<ArchiveEntry> = new LinkedList<ArchiveEntry>(this.browsingArchive.entries);

    browsingImage: ArchiveEntry = {name: '', entryName: ''};

    filter: {tags: string[]} | null = null;

    constructor(ipc: IPCQueue, storage: Storage, version: string) {
        this.ipc = ipc;
        this.storage = storage;
        this.version = version;
    }

    setArchiveList(archiveList: string[], browsingFile?: string): void {
        this.archiveList = new LinkedList(archiveList);

        logger.debug(`Archive list is set to have ${archiveList.length} archives`);

        if (browsingFile) {
            this.archiveList.readyFor(browsingFile);

            logger.debug(`Move to archive ${browsingFile}`);
        }
    }

    setImageList(imageList: ArchiveEntry[], browsingImage?: ArchiveEntry): void {
        this.imageList = new LinkedList(imageList);

        logger.debug(`Image list is set to have ${imageList.length} images`);

        if (browsingImage) {
            this.imageList.readyFor(browsingImage);

            logger.debug(`Move to image ${browsingImage.entryName}`);
        }
    }

    setBrowsingArchive(archive: Archive, options: ArchiveBrowsingOptions = {}): void {
        this.browsingArchive = archive;

        const imageList = archive.entries;

        if (options.moveToLast) {
            this.setImageList(imageList, imageList[imageList.length - 1]);
        }
        else {
            this.setImageList(imageList);

            if (options.moveToImage) {
                const entry = imageList.find(image => image.entryName === options.moveToImage);
                if (entry) {
                    this.imageList.readyFor(entry);
                }
            }
        }
    }

    setFilterTags(tags: string[]): void {
        if (tags.length) {
            logger.info(`Set filter tags to ${tags}`);

            this.filter = {tags};
        }
        else {
            logger.info('Clear filter tags');

            this.filter = null;
        }
    }

    async persist(): Promise<void> {
        logger.silly('Try to save state');

        if (this.filter) {
            const savedState = await this.storage.restoreState();
            const filterState = {
                tags: this.filter.tags,
                archive: this.archiveList.current(),
                image: this.imageList.current().entryName,
            };
            const dump = Object.assign(savedState, {filter: filterState, version: this.version});

            await this.storage.saveState(dump);
        }
        else {
            const dump: AppState = {
                archiveList: this.archiveList.toArray(),
                archive: this.archiveList.current(),
                image: this.imageList.current().entryName,
                filter: null,
                version: this.version,
            };

            await this.storage.saveState(dump);
        }
    }

    dispose(): Promise<void> {
        return this.storage.cleanup();
    }
}

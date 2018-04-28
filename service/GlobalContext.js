import log4js from 'log4js';
import LinkedList from '../common/LinkedList';

const logger = log4js.getLogger('context');

export default class GlobalContext {
    constructor(ipc, storage, version) {
        this.ipc = ipc;
        this.storage = storage;
        this.version = version;
    }

    setArchiveList(archiveList, browsingFile) {
        this.archiveList = new LinkedList(archiveList);

        logger.debug(`Archive list is set to have ${archiveList.length} archives`);

        if (browsingFile) {
            this.archiveList.readyFor(browsingFile);

            logger.debug(`Move to archive ${browsingFile}`);
        }
    }

    setImageList(imageList, browsingImage) {
        this.imageList = new LinkedList(imageList);

        logger.debug(`Image list is set to have ${imageList.length} images`);

        if (browsingImage) {
            this.imageList.readyFor(browsingImage);

            logger.debug(`Move to image ${browsingImage.entryName}`);
        }
    }

    setBrowsingArchive(archive, options = {}) {
        this.browsingArchive = archive;

        const imageList = archive.entries;

        if (options.moveToLast) {
            this.setImageList(imageList, imageList[imageList.length - 1]);
        }
        else {
            this.setImageList(imageList);

            if (options.moveToImage) {
                const entry = imageList.filter(image => image.entryName === options.moveToImage)[0];
                if (entry) {
                    this.imageList.readyFor(entry);
                }
            }
        }
    }

    setFilterTags(tags) {
        if (tags.length) {
            logger.info(`Set filter tags to ${tags}`);

            this.filter = {tags};
        }
        else {
            logger.info('Clear filter tags');

            this.filter = null;
        }
    }

    async persist() {
        logger.trace('Try to save state');

        if (this.filter) {
            const savedState = await this.storage.restoreState();
            const filterState = {
                tags: this.filter.tags,
                archive: this.archiveList.current(),
                image: this.imageList.current().entryName
            };
            const dump = Object.assign(savedState, {filter: filterState, version: this.version});

            await this.storage.saveState(dump);
        }
        else {
            const dump = {
                archiveList: this.archiveList.toArray(),
                archive: this.archiveList.current(),
                image: this.imageList.current().entryName,
                filter: null,
                version: this.version
            };

            await this.storage.saveState(dump);
        }
    }

    dispose() {
        return this.storage.cleanup();
    }
}

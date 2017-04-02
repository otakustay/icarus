import LinkedList from '../common/LinkedList';
import log4js from 'log4js';

let logger = log4js.getLogger('context');

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
        let imageList = archive.entries;

        if (options.moveToLast) {
            this.setImageList(imageList, imageList[imageList.length - 1]);
        }
        else {
            this.setImageList(imageList);

            if (options.moveToImage) {
                let entry = imageList.filter(image => image.entryName === options.moveToImage)[0];
                if (entry) {
                    this.imageList.readyFor(entry);
                }
            }
        }
    }

    async persist() {
        logger.trace('Try to save state');

        let archiveList = this.archiveList && this.archiveList.toArray();
        let archive = this.archiveList && this.archiveList.current();
        let image = this.imageList && this.imageList.current();
        let dump = {
            archiveList: archiveList,
            archive: archive,
            image: image && image.entryName,
            version: this.version
        };
        let persistData = Object.entries(dump).reduce(
            (result, [key, value]) => {
                if (value) {
                    result[key] = value;
                    return result;
                }
            },
            {}
        );

        await this.storage.saveState(persistData);
    }

    dispose() {
        return this.storage.cleanup();
    }
}

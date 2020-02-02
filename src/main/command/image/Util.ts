import {imageSize as sizeOf} from 'image-size';
import {WebContents} from 'electron';
import {Logger} from 'winston';
import {AppContext, ArchiveEntry, ClientImageInfo, BackendImageInfo} from '../../../interface';
import {datauri} from '../../util';
import previousArchive from '../previousArchive';
import nextArchive from '../nextArchive';

const isAppContext = (input: any): input is AppContext => typeof input.persist === 'function';

export default class Util {
    private readonly context: AppContext;
    private readonly sender: WebContents;
    private readonly logger: Logger;

    constructor(context: AppContext, sender: WebContents, logger: Logger) {
        this.context = context;
        this.sender = sender;
        this.logger = logger;
    }

    cacheKey(input: BackendImageInfo | AppContext): string {
        if (isAppContext(input)) {
            return `${input.archiveList.current()}/${input.imageList.current().entryName}`;
        }
        return `${input.archive}/${input.name}`;
    }

    async readImage(entry: ArchiveEntry): Promise<BackendImageInfo> {
        const buffer = await this.context.browsingArchive.readEntry(entry);
        return {
            archive: this.context.archiveList.current(),
            name: entry.entryName,
            content: buffer,
        };
    }

    sendToClient({name, content}: BackendImageInfo): void {
        const imageSize = (content.byteLength / 1024).toFixed(2);
        const {width = 0, height = 0} = sizeOf(content);

        this.logger.silly(`Image is ${name} (${imageSize}KB)`);

        const uri = datauri(name, content);

        this.logger.info('Send image command to renderer');

        const response: ClientImageInfo = {uri, name, width, height};
        this.sender.send('image', response);
    }

    async cache(type: 'previous' | 'next'): Promise<void> {
        const currentKey = this.cacheKey(this.context);
        const image = type === 'previous' ? this.context.imageList.peakPrevious() : this.context.imageList.peakNext();

        if (image) {
            const info = await this.readImage(image);
            const infoKey = this.cacheKey(info);
            const cached = type === 'previous'
                ? this.context.imageCache.cachePrevious(currentKey, infoKey, info)
                : this.context.imageCache.cacheNext(currentKey, infoKey, info);

            if (cached) {
                this.logger.silly(`Cached ${infoKey} successfully`);
            }
            else {
                this.logger.silly(`Discard expired cache ${infoKey}`);
            }
        }
    }

    async moveToArchive(type: 'previous' | 'next'): Promise<void> {
        if (type === 'previous') {
            this.logger.info('Already at the first image, move to previous archive');
            await previousArchive(this.context, this.sender, {moveToLast: true});
        }
        else {
            this.logger.info('Already at the last image, move to next archive');
            await nextArchive(this.context, this.sender, null);
        }
    }
}

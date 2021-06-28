import {Worker} from 'worker_threads';
import {imageSize as sizeOf} from 'image-size';
import {WebContents, screen} from 'electron';
import {Logger} from 'winston';
import {AppContext, ArchiveEntry, ClientImageInfo, BackendImageInfo} from '../../../interface';
import {datauri} from '../../util';
import moveToArchive from '../archive';

interface Size {
    width: number;
    height: number;
}

const computeImageSize = (buffer: Buffer) => {
    const size = sizeOf(buffer);
    return {
        width: size.width || 0,
        height: size.height || 0,
    };
};

const isAppContext = (input: any): input is AppContext => typeof input.persist === 'function';

const computeResizeScale = (imageSize: Size, screenSize: Size): number => {
    const {width: imageWidth = 0, height: imageHeight = 0} = imageSize;
    const {width: screenWidth = 0, height: screenHeight = 0} = screenSize;

    if (imageWidth > screenWidth) {
        return screenWidth / imageWidth;
    }
    if (imageHeight > screenHeight * 2) {
        return screenHeight * 2 / imageHeight;
    }
    return 1;
};

const workersPool = new Set<Worker>();

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

    async readImage(entry: ArchiveEntry, preload: boolean = false): Promise<BackendImageInfo> {
        const buffer = await this.context.browsingArchive.readEntry(entry);
        const imageSize = computeImageSize(buffer);
        const {size: screenSize} = screen.getPrimaryDisplay();
        const scale = computeResizeScale(imageSize, screenSize);
        const currentArchive = this.context.archiveList.current();

        if (scale >= 1 || !preload) {
            return {
                archive: currentArchive,
                name: entry.entryName,
                content: buffer,
                width: imageSize.width,
                height: imageSize.height,
            };
        }

        const outputWidth = Math.round(imageSize.width * scale);
        const outputHeight = Math.round(imageSize.height * scale);

        this.logger.silly(`Resize image from ${imageSize.width}x${imageSize.height} to ${outputWidth}x${outputHeight}`);

        return {
            archive: currentArchive,
            name: entry.entryName,
            content: buffer,
            width: outputWidth,
            height: outputHeight,
        };
    }

    sendToClient({name, content, width, height}: BackendImageInfo): void {
        const imageSize = (content.byteLength / 1024).toFixed(2);

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
            const info = await this.readImage(image, true);
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

    terminatePendingCache(): void {
        for (const worker of workersPool) {
            worker.terminate();
        }
        workersPool.clear();
    }

    async moveToArchive(type: 'previous' | 'next'): Promise<void> {
        const currentIndex = this.context.archiveList.currentIndex();
        if (type === 'previous') {
            this.logger.info('Already at the first image, move to previous archive');
            await moveToArchive(this.context, this.sender, {index: currentIndex - 1, moveToLast: true});
        }
        else {
            this.logger.info('Already at the last image, move to next archive');
            await moveToArchive(this.context, this.sender, {index: currentIndex + 1, moveToLast: false});
        }
    }
}

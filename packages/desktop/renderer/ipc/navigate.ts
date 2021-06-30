import {ReadingContent, ReadingCursor} from '@icarus/shared';
import {urls} from '@icarus/service';
import {createInterface} from './request';

export default {
    nextImage: createInterface<ReadingCursor, ReadingContent>(
        'GET',
        urls.nextImage
    ),
    previousImage: createInterface<ReadingCursor, ReadingContent>(
        'GET',
        urls.previousImage
    ),
};

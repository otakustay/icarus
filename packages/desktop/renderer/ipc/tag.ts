import {urls} from '@icarus/service';
import {createInterface} from './request';

export default {
    tagsByBook: createInterface<string, string[]>(
        'GET',
        urls.tagsByBook,
        {
            processInput: bookName => ({bookName}),
        }
    ),
    listAll: createInterface<void, string[]>(
        'GET',
        urls.tags
    ),
};

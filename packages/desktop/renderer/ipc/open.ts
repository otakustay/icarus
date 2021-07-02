import {ReadingContent} from '@icarus/shared';
import {urls, OpenByDirectoryBody, OpenByBooksBody} from '@icarus/service';
import {createInterface} from './request';

export default {
    openDirectory: createInterface<string, ReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: (location: string) => {
                const params: OpenByDirectoryBody = {location, type: 'directory'};
                return params;
            },
        }
    ),
    openBooks: createInterface<string[], ReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: (locations: string[]) => {
                const params: OpenByBooksBody = {locations, type: 'books'};
                return params;
            },
        }
    ),
    restore: createInterface<void, ReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: () => ({type: 'restore'}),
        }
    ),
};

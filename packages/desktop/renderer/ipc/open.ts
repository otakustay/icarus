import {urls, OpenByDirectoryBody, OpenByBooksBody} from '@icarus/service';
import {InitialReadingContent} from '@icarus/shared';
import {createInterface} from './request';

export default {
    openDirectory: createInterface<string, InitialReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: (location: string) => {
                const params: OpenByDirectoryBody = {location, type: 'directory'};
                return params;
            },
        }
    ),
    openBooks: createInterface<string[], InitialReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: (locations: string[]) => {
                const params: OpenByBooksBody = {locations, type: 'books'};
                return params;
            },
        }
    ),
    restore: createInterface<void, InitialReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: () => ({type: 'restore'}),
        }
    ),
};

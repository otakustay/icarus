import urls from '@icarus/service/urls';
import {InitialReadingContent} from '@icarus/shared';
import {createInterface} from './request';

export default {
    openDirectory: createInterface<string, InitialReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: (location: string) => {
                const params = {location, type: 'directory'};
                return params;
            },
        }
    ),
    openBooks: createInterface<string[], InitialReadingContent>(
        'POST',
        urls.shelf,
        {
            processInput: (locations: string[]) => {
                const params = {locations, type: 'books'};
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

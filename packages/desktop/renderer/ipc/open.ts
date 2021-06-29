import {ReadingContent} from '@icarus/shared';
import {urls, OpenByDirectoryBody} from '@icarus/service';
import {createInterface} from './request';

export interface OpenDirectoryRequest {
    location: string;
}

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
};

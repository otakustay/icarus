import {ReadingContent, ReadingFilter} from '@icarus/shared';
import {urls} from '@icarus/service';
import {createInterface} from './request';

export interface OpenDirectoryRequest {
    location: string;
}

export default {
    applyFilter: createInterface<ReadingFilter, ReadingContent>('POST', urls.filter),
};

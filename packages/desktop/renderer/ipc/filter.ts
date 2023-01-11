import {InitialReadingContent, ReadingFilter} from '@icarus/shared';
import urls from '@icarus/service/urls';
import {createInterface} from './request';

export default {
    applyFilter: createInterface<ReadingFilter, InitialReadingContent>('POST', urls.filter),
};

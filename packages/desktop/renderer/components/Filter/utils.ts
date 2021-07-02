import {ReadingFilter} from '@icarus/shared';

export const stringifyFilter = (filter: ReadingFilter) => {
    return filter.tagNames.join(',');
};

import urls from '@icarus/service/urls';
import {createInterface} from './request';

interface TagApply {
    bookName: string;
    tagName: string;
    active: boolean;
}

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
    applyToBook: createInterface<TagApply, void>(
        'POST',
        urls.tagsByBook
    ),
    suggestTags: createInterface<string, string[]>(
        'GET',
        urls.tagSuggestion,
        {
            processInput: bookName => ({bookName}),
        }
    ),
};

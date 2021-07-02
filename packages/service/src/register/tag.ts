import {RouteRegistry} from './interface';
import urls from './urls';

const MAX_SUGGESTED_TAG = 10;

interface Params {
    bookName: string;
}

interface Body {
    tagName: string;
    active: boolean;
}

export default (registry: RouteRegistry) => {
    registry.get(
        urls.tags,
        async context => {
            try {
                const tagNames = await context.shelf.listTags();
                await context.success(tagNames);
            }
            catch (ex) {
                /* istanbul ignore next */
                await context.error('server', 'TAG_LIST_FAIL', 'Unable to list tags', ex);
            }
        }
    );
    registry.get(
        urls.tagsByBook,
        async context => {
            const {bookName} = context.params as Params;

            try {
                const tagNames = await context.shelf.findTagsByBook(bookName);
                await context.success(tagNames);
            }
            catch (ex) {
                await context.error('server', 'TAG_READ_FAIL', `Unable to find tags for ${bookName}`, ex);
            }
        }
    );
    registry.post(
        urls.tagsByBook,
        async context => {
            const {bookName} = context.params as Params;
            const {tagName, active} = context.body as Body;

            if (!bookName) {
                await context.error('client', 'TAG_WRITE_FAIL', 'Book name is empty');
                return;
            }
            if (!tagName) {
                await context.error('client', 'TAG_WRITE_FAIL', 'Tag name is empty');
                return;
            }

            try {
                await context.shelf.applyTagToBook(bookName, tagName, active);
                await context.success();
            }
            catch (ex) {
                await context.error(
                    'server',
                    'TAG_WRITE_FAIL',
                    active
                        ? `Unable to attach tag ${tagName} to ${bookName}`
                        : `Unable to detach tag ${tagName} from ${bookName}`,
                    ex
                );
            }
        }
    );
    registry.get(
        urls.tagSuggestion,
        async context => {
            const {bookName} = context.params as Params;
            try {
                const suggests = await context.shelf.suggestTags(bookName, MAX_SUGGESTED_TAG);
                context.success(suggests);
            }
            catch {
                context.success([]);
            }
        }
    );
};

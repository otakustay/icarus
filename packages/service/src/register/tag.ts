import {RouteRegistry} from './interface';
import urls from './urls';

interface Params {
    bookName: string;
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
};

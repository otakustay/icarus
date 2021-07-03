import {ReadingFilter} from '@icarus/shared';
import {RouteRegistry} from './interface';
import urls from './urls';

export default (registry: RouteRegistry) => registry.post(
    urls.filter,
    async context => {
        const body = context.body as ReadingFilter;

        try {
            const shelf = context.shelf;
            await shelf.applyFilter(body);
            const [content, bookNames] = await Promise.all([shelf.readCurrentContent(), shelf.listBookNames()]);
            await context.success({...content, bookNames});
        }
        catch (ex) {
            await context.error('client', 'OPEN_FAIL', 'Unable to apply filter', ex);
        }
    }
);

import {ReadingFilter} from '@icarus/shared';
import {RouteRegistry} from './interface';
import urls from './urls';

export default (registry: RouteRegistry) => registry.post(
    urls.filter,
    async context => {
        const body = context.body as ReadingFilter;

        try {
            await context.shelf.applyFilter(body);
            const content = await context.shelf.readCurrentContent();
            await context.success(content);
        }
        catch (ex) {
            await context.error('client', 'OPEN_FAIL', 'Unable to apply filter', ex);
        }
    }
);

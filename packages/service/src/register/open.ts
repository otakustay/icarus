import {RouteRegistry} from './interface';
import urls from './urls';

export interface OpenByDirectoryBody {
    type: 'directory';
    location: string;
}

export interface OpenByBooksBody {
    type: 'books';
    locations: string[];
}

export interface OpenByRestoreBody {
    type: 'restore';
}

type OpenBody = OpenByDirectoryBody | OpenByBooksBody | OpenByRestoreBody;

export default (registry: RouteRegistry) => registry.post(
    urls.shelf,
    async context => {
        const shelf = context.shelf;
        const body = context.body as OpenBody;
        if (body.type === 'directory') {
            await shelf.openDirectory(body.location);
        }
        else if (body.type === 'books') {
            await shelf.openBooks(body.locations);
        }

        try {
            const [content, bookNames] = await Promise.all([shelf.readCurrentContent(), shelf.listBookNames()]);
            await context.success({...content, bookNames});
        }
        catch (ex) {
            await context.error('client', 'OPEN_FAIL', 'Unable to initialize reading state', ex);
        }
    }
);

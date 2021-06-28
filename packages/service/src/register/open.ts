import {Book, Image, ShelfState} from '@icarus/shared';
import {RouteRegistry} from './interface';
import * as urls from './urls';

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

export interface OpenResponse {
    book: Book;
    image: Image;
    shelf: ShelfState;
}

type OpenBody = OpenByDirectoryBody | OpenByBooksBody | OpenByRestoreBody;

export default (registry: RouteRegistry) => registry.post(
    urls.shelf,
    async context => {
        const body = context.body as OpenBody;
        if (body.type === 'directory') {
            await context.shelf.openDirectory(body.location);
        }
        else if (body.type === 'books') {
            await context.shelf.openBooks(body.locations);
        }

        try {
            const content = await context.shelf.readCurrentContent();
            context.success(content);
        }
        catch (ex) {
            context.error('client', 'OPEN_FAIL', 'Unable to initialize reading state', ex);
        }
    }
);

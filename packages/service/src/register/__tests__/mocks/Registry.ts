import {ReadingCursor} from '@icarus/shared';
import {RouteExecute, RouteRegistry} from '../../interface';
import ServiceContext from './ServiceContext';
import Shelf from './Shelf';

interface ExecuteInput {
    params?: unknown;
    body?: unknown;
}

export default class TestRegistry implements RouteRegistry {
    routes: Map<string, RouteExecute> = new Map();
    private cursor: ReadingCursor = {bookIndex: 0, imageIndex: 0};

    get(path: string, execute: RouteExecute) {
        this.routes.set(`GET ${path}`, execute);
    }

    post(path: string, execute: RouteExecute) {
        this.routes.set(`POST ${path}`, execute);
    }

    has(method: 'GET' | 'POST', path: string) {
        return this.routes.has(`${method} ${path}`);
    }

    setStartCursor(bookIndex: number, imageIndex: number) {
        this.cursor = {bookIndex, imageIndex};
    }

    async execute(method: 'GET' | 'POST', path: string, {params, body}: ExecuteInput) {
        const execute = this.routes.get(`${method} ${path}`);

        if (!execute) {
            throw new Error(`No route matching ${method} ${path}`);
        }

        const shelf = new Shelf();
        await shelf.moveCursor(this.cursor.bookIndex, this.cursor.imageIndex);
        const context = new ServiceContext(shelf, params, body);
        await execute(context);
        return context;
    }
}

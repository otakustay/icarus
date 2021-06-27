import {RouteExecute, RouteRegistry} from '../../interface';
import ServiceContext from './ServiceContext';
import Shelf from './Shelf';

interface ExecuteInput {
    params?: unknown;
    body?: unknown;
}

export default class TestRegistry implements RouteRegistry {
    routes: Map<string, RouteExecute> = new Map();

    get(path: string, execute: RouteExecute) {
        this.routes.set(`GET ${path}`, execute);
    }

    post(path: string, execute: RouteExecute) {
        this.routes.set(`POST ${path}`, execute);
    }

    has(method: 'GET' | 'POST', path: string) {
        return this.routes.has(`${method} ${path}`);
    }

    async execute(method: 'GET' | 'POST', path: string, {params, body}: ExecuteInput) {
        const execute = this.routes.get(`${method} ${path}`);

        if (!execute) {
            throw new Error(`No route matching ${method} ${path}`);
        }

        const shelf = new Shelf();
        const context = new ServiceContext(shelf, params, body);
        await execute(context);
        return context;
    }
}

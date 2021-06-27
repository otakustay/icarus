import {RouteExecute, RouteRegistry, Shelf} from '@icarus/service';
import {match} from 'path-to-regexp';
import ServiceContext from './ServiceContext';

interface RegisteredRoute {
    method: 'GET' | 'POST';
    path: string;
    match: ReturnType<typeof match>;
    execute: RouteExecute;
}

export default class BackendRegistry implements RouteRegistry {
    private readonly shelf: Shelf;
    private readonly routes: RegisteredRoute[] = [];

    constructor(shelf: Shelf) {
        this.shelf = shelf;
    }

    get(path: string, execute: RouteExecute): void {
        this.routes.push({path, execute, method: 'GET', match: match(path)});
    }

    post(path: string, execute: RouteExecute): void {
        this.routes.push({path, execute, method: 'POST', match: match(path)});
    }

    async execute(method: 'GET' | 'POST', url: string, body?: unknown) {
        for (const route of this.routes) {
            const result = await this.executeRoute(route, method, url, body);
            if (result) {
                return result;
            }
        }

        const routeNotFound = new ServiceContext(this.shelf, {}, {});
        await routeNotFound.error('client', 'NO_ROUTE', `No route on ${method} ${url}`);
        return routeNotFound;
    }

    private async executeRoute(route: RegisteredRoute, method: 'GET' | 'POST', url: string, body?: unknown) {
        if (route.method !== method) {
            return false;
        }

        const matched = route.match(url);

        if (!matched) {
            return false;
        }

        const context = new ServiceContext(this.shelf, matched.params, body);
        await route.execute(context);
        return context;
    }
}

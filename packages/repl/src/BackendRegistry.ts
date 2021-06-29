import {ErrorType, RouteExecute, RouteRegistry, Shelf, DefaultServiceContext} from '@icarus/service';
import {match} from 'path-to-regexp';

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

    async error(type: ErrorType, message: string) {
        const errorContext = new DefaultServiceContext(this.shelf, {}, {});
        await errorContext.error(type, 'NO_ROUTE', message);
        return errorContext;
    }

    async execute(method: 'GET' | 'POST', url: string, body?: unknown) {
        for (const route of this.routes) {
            const result = await this.executeRoute(route, method, url, body);
            if (result) {
                return result;
            }
        }

        return this.error('client', `No route on ${method} ${url}`);
    }

    private async executeRoute(route: RegisteredRoute, method: 'GET' | 'POST', url: string, body?: unknown) {
        if (route.method !== method) {
            return false;
        }

        const matched = route.match(url);

        if (!matched) {
            return false;
        }

        const context = new DefaultServiceContext(this.shelf, matched.params, body);
        await route.execute(context);
        return context;
    }
}

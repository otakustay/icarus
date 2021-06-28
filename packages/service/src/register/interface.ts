import type Shelf from '../shelf/Shelf';

export type ErrorType = 'server' | 'client';

export type ErrorCode = 'NO_ROUTE' | 'OPEN_FAIL' | 'MOVE_FAIL';

export interface ServiceContext {
    shelf: Shelf;
    params: unknown;
    body: unknown;
    cacheable(this: ServiceContext, maxAge: number): Promise<void>;
    success(this: ServiceContext, data?: any): Promise<void>;
    error(this: ServiceContext, type: ErrorType, code: ErrorCode, message: string, error?: Error): Promise<void>;
}

export type RouteExecute = (context: ServiceContext) => Promise<void>;

export interface RouteRegistry {
    get(this: RouteRegistry, path: string, execute: RouteExecute): void;
    post(this: RouteRegistry, path: string, execute: RouteExecute): void;
}

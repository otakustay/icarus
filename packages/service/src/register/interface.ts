import type Shelf from '../shelf/Shelf';
import {ServiceURL} from './urls';

export type ErrorType = 'server' | 'client';

export type ErrorCode = 'NO_ROUTE' | 'OPEN_FAIL' | 'MOVE_FAIL' | 'TAG_READ_FAIL' | 'TAG_LIST_FAIL' | 'TAG_WRITE_FAIL';

export interface ServiceContext {
    shelf: Shelf;
    params: unknown;
    body: unknown;
    cacheable(this: ServiceContext, maxAge: number): Promise<void>;
    success(this: ServiceContext, data?: any): Promise<void>;
    error(this: ServiceContext, type: ErrorType, code: ErrorCode, message: string, error?: unknown): Promise<void>;
}

export type RouteExecute = (context: ServiceContext) => Promise<void>;

export interface RouteRegistry {
    get(this: RouteRegistry, path: ServiceURL, execute: RouteExecute): void;
    post(this: RouteRegistry, path: ServiceURL, execute: RouteExecute): void;
}

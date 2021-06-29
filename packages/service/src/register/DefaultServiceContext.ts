import Shelf from '../shelf/Shelf';
import {ErrorCode, ErrorType, ServiceContext} from './interface';

interface Pending {
    state: 'pending';
}

interface Success {
    state: 'hasValue';
    data?: any;
}

interface Fail {
    state: 'hasError';
    type: ErrorType;
    code: ErrorCode;
    message: string;
    cause?: Error;
}

export default class DefaultServiceContext implements ServiceContext {
    shelf: Shelf;
    params: unknown;
    body: unknown;
    cacheMaxAge: number = 0;
    response: Success | Fail | Pending = {state: 'pending'};

    constructor(shelf: Shelf, params: unknown, body: unknown) {
        this.shelf = shelf;
        this.params = params;
        this.body = body;
    }

    async cacheable(maxAge: number) {
        this.cacheMaxAge = maxAge;
    }

    async success(data?: any) {
        this.response = {
            data,
            state: 'hasValue',
        };
    }

    async error(type: ErrorType, code: ErrorCode, message: string, cause?: Error) {
        this.response = {
            type,
            code,
            message,
            cause,
            state: 'hasError',
        };
    }
}

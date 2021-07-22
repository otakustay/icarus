import Shelf from '../../../shelf/Shelf';
import {ErrorCode, ErrorType, ServiceContext} from '../../interface';

export default class TestServiceContext implements ServiceContext {
    shelf: Shelf;
    params: unknown;
    body: unknown;
    cacheMaxAge: number = 0;
    hasError?: boolean;
    response?: any;
    errorType?: ErrorType;
    errorCode?: ErrorCode;
    errorMessage?: string;

    constructor(shelf: Shelf, params: unknown, body: unknown) {
        this.shelf = shelf;
        this.params = params;
        this.body = body;
    }

    async cacheable(maxAge: number) {
        this.cacheMaxAge = maxAge;
    }

    async success(data?: any) {
        this.hasError = false;
        this.response = data;
    }

    async error(type: ErrorType, code: 'OPEN_FAIL', message: string) {
        this.hasError = true;
        this.errorType = type;
        this.errorCode = code;
        this.errorMessage = message;
    }
}

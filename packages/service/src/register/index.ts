import {RouteRegistry} from './interface';
import registerOpen from './open';

export * as urls from './urls';
export * from './interface';
export {OpenByBooksBody, OpenByDirectoryBody, OpenByRestoreBody, OpenResponse} from './open';

export const registerService = (registery: RouteRegistry) => {
    registerOpen(registery);
};

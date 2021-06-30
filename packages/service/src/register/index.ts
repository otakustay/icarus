import {RouteRegistry} from './interface';
import registerOpen from './open';
import registerNavigate from './navigate';

export {default as urls, ServiceURL} from './urls';
export * from './interface';
export {OpenByBooksBody, OpenByDirectoryBody, OpenByRestoreBody, OpenResponse} from './open';
export {default as DefaultServiceContext} from './DefaultServiceContext';

export const registerService = (registry: RouteRegistry) => {
    registerOpen(registry);
    registerNavigate(registry);
};

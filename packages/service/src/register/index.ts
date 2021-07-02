import {RouteRegistry} from './interface';
import registerOpen from './open';
import registerNavigate from './navigate';
import registerTag from './tag';
import registerFilter from './filter';

export {default as urls, ServiceURL} from './urls';
export * from './interface';
export {OpenByBooksBody, OpenByDirectoryBody, OpenByRestoreBody, OpenResponse} from './open';
export {default as DefaultServiceContext} from './DefaultServiceContext';

export const registerService = (registry: RouteRegistry) => {
    registerOpen(registry);
    registerNavigate(registry);
    registerTag(registry);
    registerFilter(registry);
};

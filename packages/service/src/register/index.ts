import {RouteRegistry} from './interface';
import registerOpen from './open';
import registerNavigate from './navigate';

export * as urls from './urls';
export * from './interface';
export {OpenByBooksBody, OpenByDirectoryBody, OpenByRestoreBody, OpenResponse} from './open';

export const registerService = (registry: RouteRegistry) => {
    registerOpen(registry);
    registerNavigate(registry);
};

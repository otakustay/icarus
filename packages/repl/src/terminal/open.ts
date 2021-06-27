import path from 'path';
import {OpenByBooksBody, OpenByDirectoryBody, OpenByRestoreBody, urls} from '@icarus/service';
import BackendRegistry from '../BackendRegistry';

export default (registry: BackendRegistry, args: string[]) => {
    if (!args.length) {
        const body: OpenByRestoreBody = {type: 'restore'};
        return registry.execute('POST', urls.shelf, body);
    }

    if (args.length === 1 && path.extname(args[0]) !== '.zip') {
        const body: OpenByDirectoryBody = {type: 'directory', location: args[0]};
        return registry.execute('POST', urls.shelf, body);
    }

    const body: OpenByBooksBody = {type: 'books', locations: args};
    return registry.execute('POST', urls.shelf, body);
};

import {urls} from '@icarus/service';
import BackendRegistry from '../BackendRegistry';

export default (registry: BackendRegistry, [type]: string[]) => {
    switch (type) {
        case 'book':
            return registry.execute('GET', urls.previousBook);
        case 'image':
            return registry.execute('GET', urls.previousImage);
        default:
            return registry.error('client', `Unsupported navigation type ${type}`);
    }
};

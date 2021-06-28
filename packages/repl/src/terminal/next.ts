import {urls} from '@icarus/service';
import BackendRegistry from '../BackendRegistry';

export default (registry: BackendRegistry, [type]: string[]) => {
    switch (type) {
        case 'book':
            return registry.execute('GET', urls.nextBook);
        case 'image':
            return registry.execute('GET', urls.nextImage);
        default:
            return registry.error('client', `Unsupported navigation type ${type}`);
    }
};

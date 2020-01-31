import {receiveArchive} from '../../actions/archive';
import {PersistArchiveInfo} from '../../../interface';

interface BackendArchive extends PersistArchiveInfo {
    total: number;
    index: number;
}

export default ({archive, ...info}: BackendArchive) => {
    const payload = {...info, name: archive};
    return receiveArchive(payload);
};

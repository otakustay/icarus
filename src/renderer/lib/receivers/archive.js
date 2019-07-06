import {newArchive} from '../../actions';

export default info => {
    const archive = {
        name: info.archive,
        tags: info.tags,
        total: info.total,
        index: info.index,
    };

    return newArchive(archive);
};

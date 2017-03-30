import {newArchive} from '../../action';

export default info => {
    let archive = {
        name: info.archive,
        tags: info.tags,
        allTags: info.allTags
    };

    return newArchive(archive);
};

import path from 'path';
import Datauri from 'datauri';

export default (name, buffer) => {
    let extension = path.extname(name);
    let uri = new Datauri();
    uri.format(extension, buffer);

    return uri.content;
};

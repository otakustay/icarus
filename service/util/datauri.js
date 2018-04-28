import path from 'path';
import Datauri from 'datauri';

export default (name, buffer) => {
    const extension = path.extname(name);
    const uri = new Datauri();
    uri.format(extension, buffer);

    return uri.content;
};

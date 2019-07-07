import * as path from 'path';
import Datauri from 'datauri';

export default (name: string, buffer: Buffer): string => {
    const extension = path.extname(name);
    const uri = new Datauri();
    uri.format(extension, buffer);

    return uri.content;
};

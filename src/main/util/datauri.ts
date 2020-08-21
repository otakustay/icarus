import * as path from 'path';
import DatauriParser from 'datauri/parser';

export default (name: string, buffer: Buffer): string => {
    const extension = path.extname(name);
    const uri = new DatauriParser();
    uri.format(extension, buffer);

    return uri.content || '';
};

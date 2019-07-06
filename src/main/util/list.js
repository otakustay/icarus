import path from 'path';
import {promisify} from 'util';
import rawGlob from 'glob';

const glob = promisify(rawGlob);

export default async directory => {
    const list = await glob(`${directory}/*.{zip,rar}`);
    return list.sort((x, y) => path.basename(x).toLowerCase().localeCompare(path.basename(y).toLowerCase()));
};

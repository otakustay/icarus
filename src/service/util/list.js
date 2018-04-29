import path from 'path';
import denodeify from 'denodeify';
import rawGlob from 'glob';

const glob = denodeify(rawGlob);

export default async directory => {
    const list = await glob(`${directory}/*.{zip,rar}`);
    return list.sort((x, y) => path.basename(x).toLowerCase().localeCompare(path.basename(y).toLowerCase()));
};

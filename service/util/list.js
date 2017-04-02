import denodeify from 'denodeify';
import rawGlob from 'glob';
import path from 'path';

let glob = denodeify(rawGlob);

export default async directory => {
    let list = await glob(`${directory}/*.{zip,rar}`);
    return list.sort((x, y) => path.basename(x).toLowerCase().localeCompare(path.basename(y).toLowerCase()));
};

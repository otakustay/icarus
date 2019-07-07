import * as path from 'path';

export default (file: string): string => path.basename(file, path.extname(file));

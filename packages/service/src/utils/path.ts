import path from 'path';

export const extractName = (location: string) => path.basename(location, path.extname(location));

import * as path from 'path';
import electron from 'electron';
import {createLogger, format, transports} from 'winston';

const USER_DATA_DIRECTORY = electron.app.getPath('userData');
const DEBUG = !!process.env.DEBUG;

const createFileTransports = (level, filename) => {
    const options = {
        level,
        filename: path.join(USER_DATA_DIRECTORY, filename),
        maxFiles: 100,
        maxsize: 2 * 1024 * 1024,
    };
    return new transports.File(options);
};

export const getLogger = label => {
    const options = {
        transports: [
            createFileTransports('info', 'trace.log'),
            createFileTransports('warn', 'wf.log'),
        ],
        format: format.combine(
            format.label({label}),
            format.timestamp(),
            format.printf(o => `${o.level.toUpperCase()}: [${o.label}] ${o.timestamp} - ${o.message}`)
        ),
    };

    if (DEBUG) {
        options.transports.push(new transports.Console({level: 'silly'}));
    }

    return createLogger(options);
};

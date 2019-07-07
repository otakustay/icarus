import * as path from 'path';
import electron from 'electron';
import {compact} from 'lodash';
import {createLogger, format, transports, Logger} from 'winston';

const USER_DATA_DIRECTORY = electron.app.getPath('userData');
const DEBUG = !!process.env.DEBUG;

const createFileTransports = (level: string, filename: string) => {
    const options = {
        level,
        filename: path.join(USER_DATA_DIRECTORY, filename),
        maxFiles: 100,
        maxsize: 2 * 1024 * 1024,
    };
    return new transports.File(options);
};

export const getLogger = (label: string): Logger => {
    const loggerTransports = [
        createFileTransports('info', 'trace.log'),
        createFileTransports('warn', 'wf.log'),
        DEBUG && new transports.Console({level: 'silly'}),
    ];

    const options = {
        transports: compact(loggerTransports),
        format: format.combine(
            format.label({label}),
            format.timestamp(),
            format.printf(o => `${o.level.toUpperCase()}: [${o.label}] ${o.timestamp} - ${o.message}`)
        ),
    };

    return createLogger(options);
};

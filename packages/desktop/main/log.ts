import winston, {Logger, LoggerOptions} from 'winston';
import 'winston-daily-rotate-file';

interface AppLogger {
    trace: (args: Record<string, unknown>) => void;
    debug: (args: Record<string, unknown>) => void;
    info: (args: Record<string, unknown>) => void;
    warn: (args: Record<string, unknown>) => void;
    error: (args: Record<string, unknown>) => void;
}

interface LazyContainer<T> {
    current: T | null;
}

const baseOptions: LazyContainer<LoggerOptions> = {current: null};

export const setupLogging = (directory: string) => {
    if (process.env.NODE_ENV === 'development') {
        baseOptions.current = {
            level: 'silly',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
            ],
        };
    }
    else {
        const createRotation = (name: string, level: keyof AppLogger) => {
            const options = {
                level,
                dirname: directory,
                filename: `${name}-%DATE%.log`,
                maxSize: '20',
                maxFiles: '30d',
            };
            return new winston.transports.DailyRotateFile(options);
        };

        baseOptions.current = {
            level: 'info',
            transports: [
                createRotation('trace', 'info'),
                createRotation('wf', 'warn'),
            ],
        };
    }
};

export const createLogger = (name: string): AppLogger => {
    const logger: LazyContainer<Logger> = {current: null};
    const createLazyLoggingFunction = (level: keyof AppLogger, method: keyof Logger) => {
        return (args: Record<string, unknown>) => {
            if (!baseOptions.current) {
                throw new Error('Logging not initialized');
            }

            if (!logger.current) {
                logger.current = winston.createLogger({...baseOptions.current, defaultMeta: {name}});
            }

            return logger.current[method](args);
        };
    };

    const lazyWrapper: AppLogger = {
        trace: createLazyLoggingFunction('trace', 'silly'),
        debug: createLazyLoggingFunction('debug', 'debug'),
        info: createLazyLoggingFunction('info', 'info'),
        warn: createLazyLoggingFunction('warn', 'warn'),
        error: createLazyLoggingFunction('error', 'error'),
    };
    return lazyWrapper;
};

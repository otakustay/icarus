import path from 'path';
import Logger, {LoggerOptions, createLogger as createNativeLogger} from 'bunyan';

interface AppLogger {
    trace: (args: Record<string, unknown>) => void;
    debug: (args: Record<string, unknown>) => void;
    info: (args: Record<string, unknown>) => void;
    warn: (args: Record<string, unknown>) => void;
    error: (args: Record<string, unknown>) => void;
    fatal: (args: Record<string, unknown>) => void;
}

interface LazyContainer<T> {
    current: T | null;
}

const baseOptions: LazyContainer<LoggerOptions> = {current: null};

export const setupLogging = (directory: string) => {
    if (process.env.NODE_ENV === 'development') {
        baseOptions.current = {
            name: 'icarus',
            level: 'trace',
        };
    }
    else {
        baseOptions.current = {
            name: 'icarus',
            level: 'info',
            streams: [
                {
                    type: 'rotating-file',
                    period: '1m',
                    count: 12,
                    level: 'info',
                    path: path.join(directory, 'trace.log'),
                },
                {
                    type: 'rotating-file',
                    period: '1m',
                    count: 12,
                    level: 'warn',
                    path: path.join(directory, 'wf.log'),
                },
            ],
        };
    }
};

export const createLogger = (name: string): AppLogger => {
    const logger: LazyContainer<Logger> = {current: null};
    const createLazyLoggingFunction = (level: keyof AppLogger) => (args: Record<string, unknown>) => {
        if (!baseOptions.current) {
            throw new Error('Logging not initialized');
        }

        if (!logger.current) {
            logger.current = createNativeLogger({...baseOptions.current, name});
        }

        return logger.current[level](args);
    };

    const lazyWrapper: AppLogger = {
        trace: createLazyLoggingFunction('trace'),
        debug: createLazyLoggingFunction('debug'),
        info: createLazyLoggingFunction('info'),
        warn: createLazyLoggingFunction('warn'),
        error: createLazyLoggingFunction('error'),
        fatal: createLazyLoggingFunction('fatal'),
    };
    return lazyWrapper;
};

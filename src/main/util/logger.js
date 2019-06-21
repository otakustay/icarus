import {noop} from 'lodash';

export const getLogger = () => {
    return {
        info: noop,
        trace: noop,
        warn: noop,
        error: noop,
        fatal: noop,
        debug: noop,
    };
};

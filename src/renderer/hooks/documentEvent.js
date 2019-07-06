import {useLayoutEffect, useCallback} from 'react';

export default (eventName, handler, dependencies) => {
    const memoizedHandler = useCallback(handler, [eventName, ...dependencies]);
    useLayoutEffect(
        () => {
            document.addEventListener(eventName, memoizedHandler);
            return () => document.removeEventListener(eventName, memoizedHandler);
        },
        [eventName, memoizedHandler]
    );
};

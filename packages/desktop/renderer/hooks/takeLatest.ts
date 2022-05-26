import {useCallback, useRef, useState} from 'react';
import stringify from 'fast-json-stable-stringify';

type Async<I, O> = (params: I) => Promise<O>;

interface Pending {
    state: 'pending';
}

interface Resolved<T> {
    state: 'hasValue';
    data: T;
}

interface Rejected {
    state: 'hasError';
    error: Error;
}

type State<T> = Pending | Resolved<T> | Rejected;

export const useTakeLatest = <I, O>(task: Async<I, O>): [State<O>, Async<I, void>] => {
    const [state, setState] = useState<State<O>>({state: 'pending'});
    const latestKey = useRef<string | null>(null);
    const wrapped = useCallback(
        async (params: I) => {
            const key = stringify(params);
            latestKey.current = key;
            setState({state: 'pending'});
            try {
                const result = await task(params);
                if (latestKey.current === key) {
                    setState({state: 'hasValue', data: result});
                }
            }
            catch (ex) {
                if (latestKey.current === key) {
                    setState({state: 'hasError', error: ex instanceof Error ? ex : new Error(`${ex}`)});
                }
            }
        },
        [task]
    );
    return [state, wrapped];
};

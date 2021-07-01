import {useState, useMemo, useContext, createContext, ReactNode, useEffect} from 'react';
import * as R from 'ramda';

interface ContextValue {
    error: Error | null;
    setError: (error: Error | null) => void;
}

const DEFAULT_VALUE: ContextValue = {
    error: null,
    setError: R.always(undefined),
};

const Context = createContext(DEFAULT_VALUE);
Context.displayName = 'FailureContext';

interface Props {
    children: ReactNode;
}

export default function FailureContextProvider({children}: Props) {
    const [error, setError] = useState<Error | null>(null);
    const contextValue = useMemo(
        () => {
            const value: ContextValue = {error, setError};
            return value;
        },
        [error]
    );
    useEffect(
        () => {
            const handleError = (e: ErrorEvent) => {
                if (e.error instanceof Error) {
                    setError(e.error);
                }
            };
            const handleRejection = (e: PromiseRejectionEvent) => {
                if (e.reason instanceof Error) {
                    setError(e.reason);
                }
            };
            window.addEventListener('error', handleError);
            window.addEventListener('unhandledrejection', handleRejection);
            return () => {
                window.removeEventListener('error', handleError);
                window.removeEventListener('unhandledrejection', handleRejection);
            };
        },
        []
    );

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
}

export const useGlobalFailure = () => useContext(Context).error;

export const useSetGlobalFailure = () => useContext(Context).setError;

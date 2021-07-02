import {useState, useMemo, useContext, createContext, ReactNode, ComponentType, useEffect} from 'react';
import * as R from 'ramda';
import {IoAlertCircleOutline} from 'react-icons/io5';
import knownErrors from './knownErrors';

interface ContextState {
    icon: ComponentType;
    message: string;
}

interface ContextValue extends ContextState {
    setToast: (icon: ComponentType, message: string) => void;
}

const DEFAULT_STATE: ContextState = {
    icon: IoAlertCircleOutline,
    message: '',
};

const DEFAULT_VALUE: ContextValue = {
    ...DEFAULT_STATE,
    setToast: R.always(undefined),
};

const Context = createContext(DEFAULT_VALUE);
Context.displayName = 'FailureContext';

interface Props {
    children: ReactNode;
}

export default function FailureContextProvider({children}: Props) {
    const [toast, setToast] = useState(DEFAULT_STATE);
    const contextValue = useMemo(
        () => {
            const value: ContextValue = {
                ...toast,
                setToast: (icon, message) => setToast({icon, message}),
            };
            return value;
        },
        [toast]
    );
    useEffect(
        () => {
            const handleError = (e: ErrorEvent) => {
                if (e.error instanceof Error) {
                    const [icon, message] = knownErrors(e.error);
                    setToast({icon, message});
                }
            };
            const handleRejection = (e: PromiseRejectionEvent) => {
                if (e.reason instanceof Error) {
                    const [icon, message] = knownErrors(e.reason);
                    setToast({icon, message});
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

export const useToast = (): ContextState => {
    const value = useContext(Context);
    return {
        icon: value.icon,
        message: value.message,
    };
};

export const useSetToast = () => useContext(Context).setToast;

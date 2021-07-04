import {createContext, useContext, useMemo, ReactNode} from 'react';

interface ContextValue {
    disabled: boolean;
    noPadding: boolean;
}

const DEFAULT_VALUE: ContextValue = {
    disabled: false,
    noPadding: false,
};

const Context = createContext(DEFAULT_VALUE);
Context.displayName = 'TagListStatusContext';

interface Props extends ContextValue {
    children: ReactNode;
}

export default function StatusContextProvider({disabled, noPadding, children}: Props) {
    const contextValue = useMemo(
        () => ({disabled, noPadding}),
        [disabled, noPadding]
    );

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
}

export const useTagListDisabled = () => useContext(Context).disabled;

export const useTagListNoPadding = () => useContext(Context).noPadding;

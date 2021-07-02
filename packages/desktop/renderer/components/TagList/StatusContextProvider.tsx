import {createContext, useContext, ReactNode} from 'react';

const Context = createContext(false);
Context.displayName = 'StatusContext';

interface Props {
    disabled: boolean;
    children: ReactNode;
}

export default function StatusContextProvider({disabled, children}: Props) {
    return (
        <Context.Provider value={disabled}>
            {children}
        </Context.Provider>
    );
}

export const useTagListDisabled = () => useContext(Context);

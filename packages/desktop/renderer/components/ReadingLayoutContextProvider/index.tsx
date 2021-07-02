import {useState, useMemo, useContext, createContext, ReactNode} from 'react';
import * as R from 'ramda';
import {ReadingLayout} from '@/interface/layout';

const ReadContext = createContext<ReadingLayout>({hasTagList: false});
ReadContext.displayName = 'LayoutContext';

interface WriteContextValue {
    toggleTagList: () => void;
}

const DEFAULT_WRITE_VALUE: WriteContextValue = {
    toggleTagList: R.always(undefined),
};

const WriteContext = createContext(DEFAULT_WRITE_VALUE);
WriteContext.displayName = 'WriteLayoutContext';

interface Props {
    children: ReactNode;
}

export default function LayoutContextProvider({children}: Props) {
    const [layout, setLayout] = useState<ReadingLayout>({hasTagList: false});
    const methods = useMemo(
        () => {
            const toggleBy = (key: keyof ReadingLayout) => {
                return () => setLayout(s => ({...s, [key]: !s[key]}));
            };
            const methods: WriteContextValue = {
                toggleTagList: toggleBy('hasTagList'),
            };
            return methods;
        },
        []
    );

    return (
        <WriteContext.Provider value={methods}>
            <ReadContext.Provider value={layout}>
                {children}
            </ReadContext.Provider>
        </WriteContext.Provider>
    );
}

export const useTagListVisible = () => useContext(ReadContext).hasTagList;

export const useToggleTagList = () => useContext(WriteContext).toggleTagList;

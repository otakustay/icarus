import {useState, useMemo, useContext, createContext, ReactNode} from 'react';
import * as R from 'ramda';
import {ReadingLayout} from '@/interface/layout';

const DEFAULT_VALUE: ReadingLayout = {
    hasTagList: false,
    timingStart: Date.now(),
};

const ReadContext = createContext<ReadingLayout>(DEFAULT_VALUE);
ReadContext.displayName = 'LayoutContext';

interface WriteContextValue {
    toggleTagList: (value?: boolean) => void;
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
    // 从可以阅读的时刻开始重置计时
    const [layout, setLayout] = useState<ReadingLayout>(() => ({...DEFAULT_VALUE, timingStart: Date.now()}));
    const methods = useMemo(
        () => {
            const toggleBy = (key: keyof ReadingLayout) => (value?: boolean) => {
                setLayout(s => ({...s, [key]: typeof value === 'boolean' ? value : !s[key]}));
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

export const useTimingStart = () => useContext(ReadContext).timingStart;

export const useToggleTagList = () => useContext(WriteContext).toggleTagList;

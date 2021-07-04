import {useState, useMemo, useContext, createContext, ReactNode} from 'react';
import * as R from 'ramda';
import {CenterContent, ReadingLayout} from '@/interface/layout';

const DEFAULT_VALUE: ReadingLayout = {
    hasTagList: false,
    centerContent: null,
    centerPanelVisible: false,
    timingStart: Date.now(),
};

const ReadContext = createContext<ReadingLayout>(DEFAULT_VALUE);
ReadContext.displayName = 'LayoutContext';

type Toggle = (value?: boolean) => void;

interface WriteContextValue {
    toggleTagList: Toggle;
    toggleFilter: () => void;
    toggleBookList: () => void;
    toggleSettings: () => void;
    toggleHelp: () => void;
    closeCenterPanel: () => void;
}

const DEFAULT_WRITE_VALUE: WriteContextValue = {
    toggleTagList: R.always(undefined),
    toggleFilter: R.always(undefined),
    toggleBookList: R.always(undefined),
    toggleSettings: R.always(undefined),
    toggleHelp: R.always(undefined),
    closeCenterPanel: R.always(undefined),
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
            const toggleCenterTo = (content: CenterContent) => () => {
                const toggle = (state: ReadingLayout): ReadingLayout => {
                    if (state.centerContent === content) {
                        return {...state, centerPanelVisible: !state.centerPanelVisible};
                    }
                    else {
                        return {...state, centerContent: content, centerPanelVisible: true};
                    }
                };
                setLayout(toggle);
            };
            const methods: WriteContextValue = {
                toggleTagList: toggleBy('hasTagList'),
                toggleFilter: toggleCenterTo('filter'),
                toggleBookList: toggleCenterTo('bookList'),
                toggleSettings: toggleCenterTo('settings'),
                toggleHelp: toggleCenterTo('help'),
                closeCenterPanel: () => setLayout(s => ({...s, centerPanelVisible: false})),
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

export const useCenterContent = () => useContext(ReadContext).centerContent;

export const useCenterPanelVisible = () => {
    const {centerContent, centerPanelVisible} = useContext(ReadContext);
    return centerPanelVisible && centerContent !== null;
};

export const useTimingStart = () => useContext(ReadContext).timingStart;

export const useToggleTagList = () => useContext(WriteContext).toggleTagList;

export const useToggleFilter = () => useContext(WriteContext).toggleFilter;

export const useToggleBookList = () => useContext(WriteContext).toggleBookList;

export const useToggleSettings = () => useContext(WriteContext).toggleSettings;

export const useToggleHelp = () => useContext(WriteContext).toggleHelp;

export const useCloseCenterPanel = () => useContext(WriteContext).closeCenterPanel;

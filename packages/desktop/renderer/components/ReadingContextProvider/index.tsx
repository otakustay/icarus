import {useState, createContext, ReactNode, useContext} from 'react';
import * as R from 'ramda';
import {ReadingContent} from '@icarus/shared';

const DEFAULT_VALUE: ReadingContent = {
    state: {
        totalBooksCount: 0,
        activeBooksCount: 0,
        cursor: {
            bookIndex: 0,
            imageIndex: 0,
        },
        filter: {
            tagNames: [],
        },
    },
    book: {
        name: '',
        imagesCount: 0,
        size: 0,
        createTime: (new Date(0)).toISOString(),
    },
    image: {
        name: '',
        width: 0,
        height: 0,
        content: '',
    },
};

const ValueContext = createContext(DEFAULT_VALUE);
ValueContext.displayName = 'ReadingContentContext';

const SetContext = createContext<(value: ReadingContent) => void>(R.always(undefined));
SetContext.displayName = 'SetReadingContentContext';

interface Props {
    children: ReactNode;
}

export default function ReadingContextProvider({children}: Props) {
    const [value, setValue] = useState(DEFAULT_VALUE);

    return (
        <SetContext.Provider value={setValue}>
            <ValueContext.Provider value={value}>
                {children}
            </ValueContext.Provider>
        </SetContext.Provider>
    );
}

export const useReadingContent = () => useContext(ValueContext);

export const useSetReadingContent = () => useContext(SetContext);

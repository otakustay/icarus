import {useState, useCallback, createContext, ReactNode, useContext} from 'react';
import * as R from 'ramda';
import {ReadingContent, Book, Image, ReadingFilter} from '@icarus/shared';
import {LayoutType} from '@/interface/layout';

const DEFAULT_FILTER: ReadingFilter = {
    tagNames: [],
};

const DEFAULT_BOOK: Book = {
    name: '',
    imagesCount: 0,
    size: 0,
    createTime: (new Date(0)).toISOString(),
};

const DEFAULT_IMAGE: Image = {
    name: '',
    width: 0,
    height: 0,
    content: '',
};

const TotalCountContext = createContext(0);
TotalCountContext.displayName = 'TotalCountContext';

const ActiveCountContext = createContext(0);
ActiveCountContext.displayName = 'ActiveCountContext';

const BookIndexContext = createContext(0);
BookIndexContext.displayName = 'BookIndexContext';

const ImageIndexContext = createContext(0);
ImageIndexContext.displayName = 'ImageIndexContext';

const ReadingFilterContext = createContext(DEFAULT_FILTER);
ReadingFilterContext.displayName = 'ReadingFilterContext';

const BookContext = createContext(DEFAULT_BOOK);
BookContext.displayName = 'BookContext';

const ImageContext = createContext(DEFAULT_IMAGE);
ImageContext.displayName = 'ImageContext';

const SetContext = createContext<(value: ReadingContent) => void>(R.always(undefined));
SetContext.displayName = 'SetReadingContentContext';

const LayoutTypeContext = createContext<LayoutType>('topBottom');
LayoutTypeContext.displayName = 'LayoutTypeContext';

const SetLayoutTypeContext = createContext<(value: LayoutType) => void>(R.always(undefined));
SetLayoutTypeContext.displayName = 'SetLayoutTypeContext';

interface Props {
    children: ReactNode;
}

export default function ReadingContextProvider({children}: Props) {
    const [totalCount, setTotalCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [bookIndex, setBookIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const [readingFilter, setReadingFilter] = useState(DEFAULT_FILTER);
    const [book, setBook] = useState(DEFAULT_BOOK);
    const [image, setImage] = useState(DEFAULT_IMAGE);
    const [layoutType, setLayoutType] = useState<LayoutType>('topBottom');
    const setReadingContent = useCallback(
        (content: ReadingContent) => {
            setTotalCount(content.state.totalBooksCount);
            setActiveCount(content.state.activeBooksCount);
            setBookIndex(content.state.cursor.bookIndex);
            setImageIndex(content.state.cursor.imageIndex);
            setReadingFilter(content.state.filter);
            setBook(content.book);
            setImage(content.image);
        },
        []
    );

    return (
        <SetContext.Provider value={setReadingContent}>
            <SetLayoutTypeContext.Provider value={setLayoutType}>
                <LayoutTypeContext.Provider value={layoutType}>
                    <TotalCountContext.Provider value={totalCount}>
                        <ActiveCountContext.Provider value={activeCount}>
                            <BookIndexContext.Provider value={bookIndex}>
                                <ImageIndexContext.Provider value={imageIndex}>
                                    <ReadingFilterContext.Provider value={readingFilter}>
                                        <BookContext.Provider value={book}>
                                            <ImageContext.Provider value={image}>
                                                {children}
                                            </ImageContext.Provider>
                                        </BookContext.Provider>
                                    </ReadingFilterContext.Provider>
                                </ImageIndexContext.Provider>
                            </BookIndexContext.Provider>
                        </ActiveCountContext.Provider>
                    </TotalCountContext.Provider>
                </LayoutTypeContext.Provider>
            </SetLayoutTypeContext.Provider>
        </SetContext.Provider>
    );
}

export const useTotalBooksCount = () => useContext(TotalCountContext);

export const useActiveBooksCount = () => useContext(ActiveCountContext);

export const useReadingBookIndex = () => useContext(BookIndexContext);

export const useReadingImageIndex = () => useContext(ImageIndexContext);

export const useReadingFilter = () => useContext(ReadingFilterContext);

export const useReadingBook = () => useContext(BookContext);

export const useReadingImage = () => useContext(ImageContext);

export const useSetReadingContent = () => useContext(SetContext);

export const useLayoutType = () => useContext(LayoutTypeContext);

export const useSetLayoutType = () => useContext(SetLayoutTypeContext);

import {useBoolean} from '@huse/boolean';
import {
    useActiveBooksCount,
    useReadingBook,
    useReadingBookIndex,
    useReadingImageIndex,
} from '@/components/ReadingContextProvider';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_TOGGLE_INFO} from '@/dicts/keyboard';
import Minimized from './Minimized';
import Expanded from './Expanded';

export default function InfoBar() {
    const totalBooksCount = useActiveBooksCount();
    const bookIndex = useReadingBookIndex();
    const imageIndex = useReadingImageIndex();
    const book = useReadingBook();
    const [expanded, {on: expand, off: collapse, toggle}] = useBoolean();
    useGlobalShortcut(KEY_TOGGLE_INFO, toggle);

    return (
        <>
            <Minimized
                visible={!expanded}
                booksCount={totalBooksCount}
                imagesCount={book.imagesCount}
                bookIndex={bookIndex}
                imageIndex={imageIndex}
                onExpand={expand}
            />
            <Expanded
                visible={expanded}
                bookName={book.name}
                booksCount={totalBooksCount}
                imagesCount={book.imagesCount}
                bookIndex={bookIndex}
                imageIndex={imageIndex}
                onCollapse={collapse}
            />
        </>
    );
}

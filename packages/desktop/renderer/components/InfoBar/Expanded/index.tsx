import {useRef} from 'react';
import {useDocumentEvent} from '@huse/document-event';
import TopBar from './TopBar';
import BottomBar from './BottomBar';

interface Props {
    visible: boolean;
    bookName: string;
    booksCount: number;
    imagesCount: number;
    bookIndex: number;
    imageIndex: number;
    onCollapse: () => void;
}

export default function InfoBarExpanded(props: Props) {
    const {visible, bookName, booksCount, imagesCount, bookIndex, imageIndex, onCollapse} = props;
    const topRef = useRef<HTMLElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    useDocumentEvent(
        'mouseup',
        e => {
            const target = e.target as HTMLElement;
            if (visible && !topRef.current?.contains(target) && !bottomRef.current?.contains(target)) {
                onCollapse();
            }
        }
    );

    return (
        <>
            <TopBar ref={topRef} visible={visible} bookName={bookName} />
            <BottomBar
                ref={bottomRef}
                visible={visible}
                booksCount={booksCount}
                imagesCount={imagesCount}
                bookIndex={bookIndex}
                imageIndex={imageIndex}
            />
        </>
    );
}

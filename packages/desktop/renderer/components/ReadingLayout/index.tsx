import {memo} from 'react';
import ReadingLayoutContextProvider from '@/components/ReadingLayoutContextProvider';
import Content from './Content';
import BookReadableGuard from './BookReadableGuard';

function ReadingLayout() {
    return (
        <ReadingLayoutContextProvider>
            <BookReadableGuard>
                <Content />
            </BookReadableGuard>
        </ReadingLayoutContextProvider>
    );
}

export default memo(ReadingLayout);

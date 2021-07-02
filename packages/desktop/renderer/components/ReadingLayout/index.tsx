import ReadingLayoutContextProvider from '@/components/ReadingLayoutContextProvider';
import Content from './Content';
import BookReadableGuard from './BookReadableGuard';

export default function ReadingLayout() {
    return (
        <ReadingLayoutContextProvider>
            <BookReadableGuard>
                <Content />
            </BookReadableGuard>
        </ReadingLayoutContextProvider>
    );
}

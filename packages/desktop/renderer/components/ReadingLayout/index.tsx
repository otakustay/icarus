import ReadingLayoutContextProvider from '@/components/ReadingLayoutContextProvider';
import Content from './Content';
import BookReadableGuard from './BookReadableGuard';

// TODO: 标签列表悬浮显示

export default function ReadingLayout() {
    return (
        <ReadingLayoutContextProvider>
            <BookReadableGuard>
                <Content />
            </BookReadableGuard>
        </ReadingLayoutContextProvider>
    );
}

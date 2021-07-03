import styled from 'styled-components';
import {
    useActiveBooksCount,
    useReadingBook,
    useReadingBookIndex,
    useReadingImageIndex,
} from '@/components/ReadingContextProvider';

const Layout = styled.aside`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 8px;
    background-color: rgba(53, 53, 53, .7);
    color: #ddd;
`;

export default function InfoBar() {
    const totalBooksCount = useActiveBooksCount();
    const bookIndex = useReadingBookIndex();
    const imageIndex = useReadingImageIndex();
    const book = useReadingBook();

    return (
        <Layout>
            第 {bookIndex + 1}/{totalBooksCount} 本 {imageIndex + 1}/{book.imagesCount} 页
        </Layout>
    );
}

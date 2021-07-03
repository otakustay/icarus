import styled from 'styled-components';
import {useReadingBookIndex, useTotalBookNames} from '@/components/ReadingContextProvider';
import Row from './Row';

const Layout = styled.ol`
    list-style: none;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #ddd;
`;

interface Props {
    onSelect: (bookIndex: number) => void;
}

export default function BookSelect({onSelect}: Props) {
    const bookNames = useTotalBookNames();
    const currentReadingBookIndex = useReadingBookIndex();
    const renderRow = (bookName: string, bookIndex: number) => (
        <Row
            key={bookName}
            bookName={bookName}
            bookIndex={bookIndex}
            relativeIndex={bookIndex - currentReadingBookIndex}
            onSelect={onSelect}
        />
    );

    return (
        <Layout>
            {bookNames.map(renderRow)}
        </Layout>
    );
}

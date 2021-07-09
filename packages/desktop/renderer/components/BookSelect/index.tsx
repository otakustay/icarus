import {useCallback} from 'react';
import styled from '@emotion/styled';
import {useReadingBookIndex, useSetReadingContent, useTotalBookNames} from '@/components/ReadingContextProvider';
import {useRemote} from '@/components/RemoteContextProvider';
import Row from './Row';

const Layout = styled.ol`
    list-style: none;
    margin: 0;
    padding: 0;
`;

interface Props {
    className?: string;
    onComplete: () => void;
}

export default function BookSelect({className, onComplete}: Props) {
    const bookNames = useTotalBookNames();
    const currentReadingBookIndex = useReadingBookIndex();
    const setReadingContent = useSetReadingContent();
    const {navigate: ipc} = useRemote();
    const moveToBook = useCallback(
        async (bookIndex: number) => {
            const content = await ipc.moveCursor({bookIndex, imageIndex: 0});
            setReadingContent(content);
            onComplete();
        },
        [ipc, setReadingContent, onComplete]
    );
    const renderRow = (bookName: string, bookIndex: number) => (
        <Row
            key={bookName}
            bookName={bookName}
            bookIndex={bookIndex}
            relativeIndex={bookIndex - currentReadingBookIndex}
            onSelect={moveToBook}
        />
    );

    return (
        <Layout className={className}>
            {bookNames.map(renderRow)}
        </Layout>
    );
}

import {useCallback} from 'react';
import styled from 'styled-components';
import DropZone from '@/components/DropZone';
import ReadingContextProvider, {useReadingContent, useSetReadingContent} from '@/components/ReadingContextProvider';
import ReadingLayout from '@/components/ReadingLayout';
import ipc from '@/ipc/open';
import GlobalStyle from './GlobalStyle';

const Root = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

function AppContent() {
    const readingContent = useReadingContent();
    const setReadingContent = useSetReadingContent();
    const openDirectory = useCallback(
        async (location: string) => {
            const content = await ipc.openDirectory(location);
            setReadingContent(content);
        },
        [setReadingContent]
    );

    return readingContent.state.totalBooksCount
        ? <ReadingLayout />
        : <DropZone onOpenDirectory={openDirectory} />;
}

export default function App() {
    return (
        <>
            <GlobalStyle />
            <Root>
                <ReadingContextProvider>
                    <AppContent />
                </ReadingContextProvider>
            </Root>
        </>
    );
}
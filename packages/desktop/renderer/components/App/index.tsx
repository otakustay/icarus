import {useCallback} from 'react';
import styled from 'styled-components';
import DropZone from '@/components/DropZone';
import ReadingContextProvider, {useSetReadingContent, useTotalBooksCount} from '@/components/ReadingContextProvider';
import ReadingLayout from '@/components/ReadingLayout';
import ipc from '@/ipc/open';
import GlobalStyle from './GlobalStyle';

const Root = styled.div`
    width: 100vw;
    height: 100vh;
`;

function AppContent() {
    const totalCount = useTotalBooksCount();
    const setReadingContent = useSetReadingContent();
    const openDirectory = useCallback(
        async (location: string) => {
            const content = await ipc.openDirectory(location);
            setReadingContent(content);
        },
        [setReadingContent]
    );

    return totalCount
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

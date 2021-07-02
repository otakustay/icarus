import styled from 'styled-components';
import DropZone from '@/components/DropZone';
import ReadingContextProvider, {useSetReadingContent, useTotalBooksCount} from '@/components/ReadingContextProvider';
import ToastContextProvider from '@/components/ToastContextProvider';
import RemoteContextProvider, {useRemote} from '@/components/RemoteContextProvider';
import ReadingLayout from '@/components/ReadingLayout';
import Toast from '@/components/Toast';
import PendingIndicator from '@/components/PendingIndicator';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_RESTORE} from '@/dicts/keyboard';
import GlobalStyle from './GlobalStyle';
import {useDrop, useOpen} from './hooks';

const Root = styled.div`
    width: 100vw;
    height: 100vh;
`;

// TODO: 全屏功能

function AppContent() {
    const totalCount = useTotalBooksCount();
    const open = useOpen();
    const isDraggingOver = useDrop(open);
    const setReadingContent = useSetReadingContent();
    const {open: ipc} = useRemote();
    useGlobalShortcut(
        KEY_RESTORE,
        async () => {
            const content = await ipc.restore();
            setReadingContent(content);
        }
    );

    return totalCount ? <ReadingLayout /> : <DropZone isDraggingOver={isDraggingOver} />;
}

export default function App() {
    return (
        <>
            <GlobalStyle />
            <Root>
                <ToastContextProvider>
                    <ReadingContextProvider>
                        <RemoteContextProvider>
                            <AppContent />
                            <PendingIndicator />
                        </RemoteContextProvider>
                    </ReadingContextProvider>
                    <Toast />
                </ToastContextProvider>
            </Root>
        </>
    );
}

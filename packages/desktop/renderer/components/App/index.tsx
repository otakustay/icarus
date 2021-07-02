import {useCallback} from 'react';
import styled from 'styled-components';
import {IoBookOutline} from 'react-icons/io5';
import DropZone from '@/components/DropZone';
import ReadingContextProvider, {useSetReadingContent, useTotalBooksCount} from '@/components/ReadingContextProvider';
import ToastContextProvider, {useSetToast} from '@/components/ToastContextProvider';
import RemoteContextProvider, {useRemote} from '@/components/RemoteContextProvider';
import ReadingLayout from '@/components/ReadingLayout';
import Toast from '@/components/Toast';
import PendingIndicator from '@/components/PendingIndicator';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_RESTORE} from '@/dicts/keyboard';
import GlobalStyle from './GlobalStyle';

const Root = styled.div`
    width: 100vw;
    height: 100vh;
`;

// TODO: 全屏功能
// TODO: 打开指定文件
// TODO: 打开、恢复功能始终有效

function AppContent() {
    const totalCount = useTotalBooksCount();
    const setReadingContent = useSetReadingContent();
    const {open: ipc} = useRemote();
    const setToast = useSetToast();
    const openDirectory = useCallback(
        async (location: string) => {
            const content = await ipc.openDirectory(location);

            if (content.state.totalBooksCount) {
                setReadingContent(content);
            }
            else {
                setToast(IoBookOutline, '找不到可看的本子呢');
            }
        },
        [ipc, setReadingContent, setToast]
    );
    useGlobalShortcut(
        KEY_RESTORE,
        async () => {
            const content = await ipc.restore();
            setReadingContent(content);
        }
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

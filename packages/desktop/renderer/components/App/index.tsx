import {useCallback} from 'react';
import styled from 'styled-components';
import DropZone from '@/components/DropZone';
import ReadingContextProvider, {useSetReadingContent, useTotalBooksCount} from '@/components/ReadingContextProvider';
import FailureContextProvider from '@/components/FailureContextProvider';
import RemoteContextProvider, {useRemote} from '@/components/RemoteContextProvider';
import ReadingLayout from '@/components/ReadingLayout';
import FailureToast from '@/components/FailureToast';
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
// TODO: 计时器
// TODO: 本子、图片进度显示
// TODO: 标签过滤

function AppContent() {
    const totalCount = useTotalBooksCount();
    const setReadingContent = useSetReadingContent();
    const {open: ipc} = useRemote();
    const openDirectory = useCallback(
        async (location: string) => {
            const content = await ipc.openDirectory(location);
            setReadingContent(content);
        },
        [ipc, setReadingContent]
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
                <FailureContextProvider>
                    <ReadingContextProvider>
                        <RemoteContextProvider>
                            <AppContent />
                            <PendingIndicator />
                        </RemoteContextProvider>
                    </ReadingContextProvider>
                    <FailureToast />
                </FailureContextProvider>
            </Root>
        </>
    );
}

import {useCallback} from 'react';
import {IoBookOutline} from 'react-icons/io5';
import {useDocumentEvent} from '@huse/document-event';
import {useSwitch} from '@huse/boolean';
import {ReadingContent} from '@icarus/shared';
import {useSetReadingContent} from '@/components/ReadingContextProvider';
import {useRemote} from '@/components/RemoteContextProvider';
import {useSetToast} from '@/components/ToastContextProvider';
import ipcOpen from '@/ipc/open';

const openByType = (ipc: typeof ipcOpen, files: string[]): Promise<ReadingContent> => {
    if (files.length === 1 && !files[0].endsWith('.zip')) {
        const [directory] = files;
        return ipc.openDirectory(directory);
    }

    const books = files.filter(v => v.endsWith('.zip'));

    if (!books.length) {
        throw new Error('No book found');
    }

    return ipc.openBooks(books);
};

export const useOpen = () => {
    const setReadingContent = useSetReadingContent();
    const {open: ipc} = useRemote();
    const setToast = useSetToast();
    const open = useCallback(
        async (files: string[]) => {
            try {
                const content = await openByType(ipc, files);
                if (content.state.totalBooksCount) {
                    setReadingContent(content);
                }
                else {
                    throw new Error('No book found');
                }
            }
            catch {
                setToast(IoBookOutline, '找不到可看的本子呢');
            }
        },
        [ipc, setReadingContent, setToast]
    );
    return open;
};

export const useDrop = (onDrop: (files: string[]) => void) => {
    const [isDraggingOver, dragOver, dragOut] = useSwitch(false);
    useDocumentEvent('dragover', e => e.preventDefault());
    useDocumentEvent('dragenter', dragOver);
    useDocumentEvent(
        'dragleave',
        e => {
            if (!e.relatedTarget) {
                dragOut();
            }
        }
    );
    const drop = useCallback(
        (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();

            if (!e.dataTransfer?.files.length) {
                return;
            }

            onDrop([...e.dataTransfer.files].map(v => v.path));
            dragOut();
        },
        [onDrop, dragOut]
    );
    useDocumentEvent('drop', drop);

    return isDraggingOver;
};

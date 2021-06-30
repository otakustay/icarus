import {useCallback} from 'react';
import {Direction} from '@icarus/shared';
import ImageView from '@/components/ImageView';
import ipc from '@/ipc/navigate';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {useReadingBookIndex, useReadingImageIndex, useSetReadingContent} from '../ReadingContextProvider';

export default function ReadingLayout() {
    const bookIndex = useReadingBookIndex();
    const imageIndex = useReadingImageIndex();
    const setReadingContent = useSetReadingContent();
    const navigateImage = useCallback(
        async (direction: Direction) => {
            const request = direction === 'forward' ? ipc.nextImage : ipc.previousImage;
            try {
                const content = await request({bookIndex, imageIndex});
                setReadingContent(content);
            }
            catch (ex) {
                // TODO: 需要错误处理
                // eslint-disable-next-line no-console
                console.log(ex.message);
            }
        },
        [bookIndex, imageIndex, setReadingContent]
    );
    useGlobalShortcut(
        ['N', 'E'],
        async () => {
            const content = await ipc.nextBook({bookIndex, imageIndex});
            setReadingContent(content);
        }
    );
    useGlobalShortcut(
        ['P', 'Q'],
        async () => {
            const content = await ipc.previousBook({bookIndex, imageIndex});
            setReadingContent(content);
        }
    );

    return (
        <ImageView onNavigate={navigateImage} />
    );
}

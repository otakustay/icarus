import {useCallback} from 'react';
import {Direction} from '@icarus/shared';
import ImageView from '@/components/ImageView';
import ipc from '@/ipc/navigate';
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

    return (
        <ImageView onNavigate={navigateImage} />
    );
}

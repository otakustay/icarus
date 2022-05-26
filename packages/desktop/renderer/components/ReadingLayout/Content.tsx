import {useCallback} from 'react';
import {Direction, stringifyError} from '@icarus/shared';
import ImageView from '@/components/ImageView';
import {useRemote} from '@/components/RemoteContextProvider';
import {useReadingBookIndex, useReadingImageIndex, useSetReadingContent} from '@/components/ReadingContextProvider';
import InfoBar from '@/components/InfoBar';

export default function Content() {
    const bookIndex = useReadingBookIndex();
    const imageIndex = useReadingImageIndex();
    const setReadingContent = useSetReadingContent();
    const {navigate: ipc} = useRemote();
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
                console.log(stringifyError(ex));
            }
        },
        [bookIndex, imageIndex, ipc.nextImage, ipc.previousImage, setReadingContent]
    );

    return (
        <>
            <ImageView onNavigate={navigateImage} />
            <InfoBar />
        </>
    );
}

import {ReactNode} from 'react';
import {IoImagesOutline} from 'react-icons/io5';
import FullSizeWarn from '@/components/FullSizeWarn';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {
    KEY_NEXT_BOOK,
    KEY_NEXT_IMAGE,
    KEY_NEXT_STEP,
    KEY_PREVIOUS_BOOK,
    KEY_PREVIOUS_IMAGE,
    KEY_PREVIOUS_STEP,
} from '@/dicts/keyboard';
import {
    useReadingBookIndex,
    useReadingBookUnsafe,
    useReadingImageIndex,
    useSetReadingContent,
} from '../ReadingContextProvider';
import {useRemote} from '../RemoteContextProvider';

function BookBroken() {
    const bookIndex = useReadingBookIndex();
    const imageIndex = useReadingImageIndex();
    const setReadingContent = useSetReadingContent();
    const {navigate: ipc} = useRemote();
    // 代替图片阅读的功能，要把前后移动的快捷键绑好。因为这里没有图片，所以快捷键均绑到图片粒度
    useGlobalShortcut(
        [...KEY_NEXT_IMAGE, ...KEY_NEXT_STEP],
        async () => {
            const content = await ipc.nextImage({bookIndex, imageIndex});
            setReadingContent(content);
        }
    );
    // 但是往前读不一样，因为涉及到要定位到上一本的最后一页，所以“前一张图”和“前一步”要定位到图片上去
    useGlobalShortcut(
        [...KEY_PREVIOUS_IMAGE, ...KEY_PREVIOUS_STEP],
        async () => {
            const content = await ipc.previousImage({bookIndex, imageIndex});
            setReadingContent(content);
        }
    );

    return <FullSizeWarn size={160} icon={<IoImagesOutline />} description="当前本子无法访问或已损坏" />;
}

interface Props {
    children: ReactNode;
}

export default function BookReadableGuard({children}: Props) {
    const readingBook = useReadingBookUnsafe();
    const bookIndex = useReadingBookIndex();
    const imageIndex = useReadingImageIndex();
    const setReadingContent = useSetReadingContent();
    const {navigate: ipc} = useRemote();
    // 如果不能读本子，就把所有往后阅读的快捷键都绑到移本子上去
    useGlobalShortcut(
        KEY_NEXT_BOOK,
        async () => {
            const content = await ipc.nextBook({bookIndex, imageIndex});
            setReadingContent(content);
        }
    );
    // 但是往前读不一样，因为涉及到要定位到上一本的最后一页，所以“前一张图”和“前一步”要定位到图片上去
    useGlobalShortcut(
        KEY_PREVIOUS_BOOK,
        async () => {
            const content = await ipc.previousBook({bookIndex, imageIndex});
            setReadingContent(content);
        }
    );

    return readingBook ? <>{children}</> : <BookBroken />;
}

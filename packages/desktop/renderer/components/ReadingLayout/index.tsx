import {useCallback} from 'react';
import styled from 'styled-components';
import {Direction} from '@icarus/shared';
import ImageView from '@/components/ImageView';
import TagList from '@/components/TagList';
import {useReadingBookIndex, useReadingImageIndex, useSetReadingContent} from '../ReadingContextProvider';
import {useRemote} from '../RemoteContextProvider';
import BookReadableGuard from './BookReadableGuard';

const Layout = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 30%;
    width: 100%;
    height: 100%;
`;

export default function ReadingLayout() {
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
                console.log(ex.message);
            }
        },
        [bookIndex, imageIndex, ipc.nextImage, ipc.previousImage, setReadingContent]
    );

    return (
        <BookReadableGuard>
            <Layout>
                <ImageView onNavigate={navigateImage} />
                <TagList />
            </Layout>
        </BookReadableGuard>
    );
}

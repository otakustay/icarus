import {useCallback, forwardRef, ForwardedRef} from 'react';
import styled from '@emotion/styled';
import {CSSTransition} from 'react-transition-group';
import {Progress, Panel, bottomToTopTransition} from '@icarus/component';
import {useSetReadingContent} from '@/components/ReadingContextProvider';
import {useRemote} from '@/components/RemoteContextProvider';
import BookSelectTrigger from './BookSelectTrigger';
import FilterTrigger from './FilterTrigger';
import HelpTrigger from './HelpTrigger';

const useMoveImage = (bookIndex: number) => {
    const setReadingContent = useSetReadingContent();
    const {navigate: ipc} = useRemote();
    const moveToImage = useCallback(
        async (imageIndex: number) => {
            const content = await ipc.moveCursor({bookIndex, imageIndex});
            setReadingContent(content);
        },
        [bookIndex, ipc, setReadingContent]
    );
    return moveToImage;
};

const ProgressBar = styled.div`
    margin-left: 20px;
`;

const Layout = styled(Panel)`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    height: 40px;
    font-size: 14px;
    padding: 0 12px;
    display: grid;
    grid-template-columns: repeat(3, auto) 1fr max-content;
    grid-column-gap: 20px;
    align-items: center;
    ${bottomToTopTransition()}
`;

interface Props {
    forwardedRef: ForwardedRef<HTMLDivElement>;
    visible: boolean;
    booksCount: number;
    imagesCount: number;
    bookIndex: number;
    imageIndex: number;
}

// TODO: 配置设置 <IconTrigger icon={<IoSettingsOutline />} />
function InfoBottomBar({forwardedRef, visible, booksCount, imagesCount, bookIndex, imageIndex}: Props) {
    const moveToImage = useMoveImage(bookIndex);

    return (
        <CSSTransition nodeRef={forwardedRef} in={visible} timeout={300} classNames="bottom-to-top">
            <Layout ref={forwardedRef}>
                <BookSelectTrigger />
                <FilterTrigger />
                <HelpTrigger />
                <ProgressBar>
                    <Progress total={imagesCount} current={imageIndex} onChange={moveToImage} />
                </ProgressBar>
                <span>第 {bookIndex + 1}/{booksCount} 本 {imageIndex + 1}/{imagesCount} 页</span>
            </Layout>
        </CSSTransition>
    );
}

type Exported = Omit<Props, 'forwardedRef'>;

export default forwardRef<HTMLDivElement, Exported>((props, ref) => <InfoBottomBar {...props} forwardedRef={ref} />);

import {useRef} from 'react';
import styled from '@emotion/styled';
import {CSSTransition} from 'react-transition-group';
import {IoInformationCircleOutline} from 'react-icons/io5';
import {Panel, fadeTransition} from '@icarus/component';

interface VisibleProps {
    visible: boolean;
}

const Layout = styled(Panel)<VisibleProps>`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 8px;
    opacity: ${({visible}) => (visible ? 1 : 0)};
    ${fadeTransition({defaultToInvisible: false})}
`;

const ExpandIcon = styled(IoInformationCircleOutline)`
    cursor: pointer;
    font-size: 14px;

    &:hover {
        color: var(--color-panel-text-hover);
    }
`;

interface Props {
    visible: boolean;
    booksCount: number;
    imagesCount: number;
    bookIndex: number;
    imageIndex: number;
    onExpand: () => void;
}

export default function InfoBarMinimized({visible, booksCount, imagesCount, bookIndex, imageIndex, onExpand}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <CSSTransition nodeRef={ref} in={visible} timeout={300} classNames="fade">
            <Layout translucent ref={ref} as="aside" visible={visible}>
                第 {bookIndex + 1}/{booksCount} 本 {imageIndex + 1}/{imagesCount} 页
                <ExpandIcon onClick={onExpand} />
            </Layout>
        </CSSTransition>
    );
}

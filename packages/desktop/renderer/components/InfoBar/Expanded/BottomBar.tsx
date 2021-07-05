import {forwardRef, ForwardedRef} from 'react';
import styled from 'styled-components';
import {CSSTransition} from 'react-transition-group';
import {Progress, Panel, bottomToTopTransition} from '@icarus/component';
import BookSelectTrigger from './BookSelectTrigger';
import FilterTrigger from './FilterTrigger';
import HelpTrigger from './HelpTrigger';

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
    forwardedRef: ForwardedRef<HTMLElement>;
    visible: boolean;
    booksCount: number;
    imagesCount: number;
    bookIndex: number;
    imageIndex: number;
}

// TODO: 配置设置 <IconTrigger icon={<IoSettingsOutline />} />
function InfoBottomBar({forwardedRef, visible, booksCount, imagesCount, bookIndex, imageIndex}: Props) {
    return (
        <CSSTransition in={visible} timeout={300} classNames="bottom-to-top">
            <Layout as="aside" ref={forwardedRef}>
                <BookSelectTrigger />
                <FilterTrigger />
                <HelpTrigger />
                <Progress total={imagesCount} current={imageIndex} />
                <span>第 {bookIndex + 1}/{booksCount} 本 {imageIndex + 1}/{imagesCount} 页</span>
            </Layout>
        </CSSTransition>
    );
}

type ExportedProps = Omit<Props, 'forwardedRef'>;

export default forwardRef<HTMLElement, ExportedProps>((props, ref) => <InfoBottomBar {...props} forwardedRef={ref} />);

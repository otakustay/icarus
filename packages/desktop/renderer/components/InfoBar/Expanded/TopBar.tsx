import {forwardRef, ForwardedRef} from 'react';
import styled from 'styled-components';
import {CSSTransition} from 'react-transition-group';
import {topToBottomTransition} from '@/utils/transition';

const Layout = styled.aside`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    height: 30px;
    display: grid;
    grid-template-columns: auto max-content;
    grid-auto-flow: column;
    grid-column-gap: 4px;
    align-items: center;
    justify-content: center;
    padding: 0 40px;
    background-color: var(--color-app-background);
    color: var(--color-panel-text);
    ${topToBottomTransition()}
`;

const BookName = styled.h1`
    font-size: 14px;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

interface Props {
    forwardedRef: ForwardedRef<HTMLElement>;
    visible: boolean;
    bookName: string;
}

function InfoTopBar({forwardedRef, visible, bookName}: Props) {
    return (
        <>
            <CSSTransition in={visible} timeout={300} classNames="top-to-bottom">
                <Layout ref={forwardedRef}>
                    <BookName>{bookName}</BookName>
                </Layout>
            </CSSTransition>
        </>
    );
}

type ExportedProps = Omit<Props, 'forwardedRef'>;

export default forwardRef<HTMLElement, ExportedProps>((props, ref) => <InfoTopBar {...props} forwardedRef={ref} />);

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
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    padding: 0 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #000;
    color: #ddd;
    ${topToBottomTransition()}
`;

interface Props {
    forwardedRef: ForwardedRef<HTMLElement>;
    visible: boolean;
    bookName: string;
}

function InfoTopBar({forwardedRef, visible, bookName}: Props) {
    return (
        <CSSTransition in={visible} timeout={300} classNames="top-to-bottom">
            <Layout ref={forwardedRef}>
                {bookName}
            </Layout>
        </CSSTransition>
    );
}

type ExportedProps = Omit<Props, 'forwardedRef'>;

export default forwardRef<HTMLElement, ExportedProps>((props, ref) => <InfoTopBar {...props} forwardedRef={ref} />);

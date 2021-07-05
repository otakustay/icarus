import {forwardRef, ForwardedRef} from 'react';
import styled from 'styled-components';
import {CSSTransition} from 'react-transition-group';
import {topToBottomTransition} from '@icarus/component';

const Layout = styled.aside`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    display: grid;
    grid-template-columns: auto max-content;
    grid-auto-flow: column;
    grid-column-gap: 4px;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 36px 40px 16px;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: var(--color-app-background);
    color: var(--color-panel-text);
    ${topToBottomTransition()}
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
                    {bookName}
                </Layout>
            </CSSTransition>
        </>
    );
}

type ExportedProps = Omit<Props, 'forwardedRef'>;

export default forwardRef<HTMLElement, ExportedProps>((props, ref) => <InfoTopBar {...props} forwardedRef={ref} />);

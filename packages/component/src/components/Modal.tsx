import {ReactNode} from 'react';
import styled from 'styled-components';
import {CSSTransition} from 'react-transition-group';
import {IoClose} from 'react-icons/io5';
import {createTransition} from '../utils/transition';

const zoomTransition = createTransition(
    'zoom',
    {
        property: 'transform',
        from: 'translate(-50%, -50%) scale(0)',
        to: 'translate(-50%, -50%) scale(1)',
        duration: 300,
        timingFunction: 'ease-in-out',
        defaultToInvisible: true,
    }
);

const Title = styled.header`
    grid-area: title;
    font-size: 18px;
    color: var(--color-panel-text);
`;

const Close = styled(IoClose)`
    grid-area: close;
    width: 100%;
    height: 100%;
    color: var(--color-panel-text);
    cursor: pointer;

    &:hover {
        color: var(--color-panel-contrast-text);
    }
`;

const Content = styled.div`
    grid-area: content;
    height: 100%;
    overflow: auto;
`;

const Layout = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    width: 60vw;
    height: 60vh;
    padding: 12px;
    display: grid;
    grid-template:
        "title close" 20px
        "content content" 1fr / 1fr 20px;
    grid-row-gap: 20px;
    background-color: var(--color-panel-background);
    border-radius: 12px;
    z-index: 30;
    color: var(--color-panel-text);
    ${zoomTransition}
`;

export interface Props {
    visible?: boolean;
    title: string;
    children: ReactNode;
    onClose?: () => void;
}

export default function Panel({visible = false, title, children, onClose}: Props) {
    return (
        <CSSTransition mountOnEnter in={visible} timeout={300} classNames="zoom">
            <Layout>
                <Title>{title}</Title>
                <Close onClick={onClose} />
                <Content>
                    {children}
                </Content>
            </Layout>
        </CSSTransition>
    );
}

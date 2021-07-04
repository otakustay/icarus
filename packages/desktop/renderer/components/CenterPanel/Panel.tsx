import {ReactNode} from 'react';
import styled from 'styled-components';
import {CSSTransition} from 'react-transition-group';
import {IoClose} from 'react-icons/io5';
import {createTransition} from '@/utils/transition';

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
    color: #ddd;
`;

const Close = styled(IoClose)`
    grid-area: close;
    width: 100%;
    height: 100%;
    color: #ddd;
    cursor: pointer;

    &:hover {
        color: #fff;
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
    background-color: #525252;
    border-radius: 12px;
    z-index: 30;
    ${zoomTransition}
`;

interface Props {
    visible: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

// TODO: 直接关闭功能
export default function Panel({visible, title, children, onClose}: Props) {
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

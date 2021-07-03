import {useRef, useState, useEffect, ReactNode} from 'react';
import styled from 'styled-components';

const Layout = styled.div`
    position: fixed;
    width: 45%;
    max-height: 480px;
    top: 30px;
    z-index: 90;
    transform: translate(-50%);
    overflow: scroll;
`;

interface Props {
    left: number;
    children: ReactNode;
}

export default function AutoJustOverlay({left, children}: Props) {
    const [computedLeft, setComputedLeft] = useState(left);
    const [layoutComputed, setLayoutComputed] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(
        () => {
            const element = ref.current;

            if (!element) {
                return;
            }

            const clientRect = element.getBoundingClientRect();
            // 因为宽度不可能超过全宽度，所以只需要管左右移动就行
            if (clientRect.left < 0) {
                setComputedLeft(v => v - clientRect.left);
            }
            else if (clientRect.right > window.innerWidth) {
                setComputedLeft(v => v - (clientRect.right - window.innerWidth));
            }

            setLayoutComputed(true);
        },
        []
    );

    return (
        <Layout ref={ref} style={{visibility: layoutComputed ? 'initial' : 'hidden', left: computedLeft}}>
            {children}
        </Layout>
    );
}

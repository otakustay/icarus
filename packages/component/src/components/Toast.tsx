import {useEffect, useRef, ReactElement, ReactNode} from 'react';
import styled from 'styled-components';
import Panel from './Panel';

const FAILURE_NOTIFY_TIME_MS = 1000 * 3;

const Layout = styled(Panel)`
    position: fixed;
    left: 40px;
    bottom: 40px;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 48px;
    padding: 0 24px;
    font-size: 16px;
    border-radius: 8px;
    transition: opacity .6s linear;
`;

export interface Props {
    icon: ReactElement;
    children: ReactNode;
    onExit?: () => void;
}

export default function Toast({icon, children, onExit}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(
        () => {
            if (!children) {
                return;
            }

            const animation: {current: Animation | undefined} = {current: undefined};
            const tick = setTimeout(
                () => {
                    animation.current = ref.current?.animate(
                        [
                            {transform: 'translateY(0)'},
                            {transform: 'translateY(88px)'},
                        ],
                        {duration: 150}
                    );
                    animation.current?.addEventListener('finish', () => (onExit && onExit()));
                },
                FAILURE_NOTIFY_TIME_MS
            );
            return () => {
                clearTimeout(tick);
                animation.current?.cancel();
            };
        },
        [icon, children, onExit]
    );

    if (!children) {
        return null;
    }

    return (
        <Layout opacity ref={ref}>
            {icon}
            <span>{children}</span>
        </Layout>
    );
}

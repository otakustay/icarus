import {createElement, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {useToast, useSetToast} from '@/components/ToastContextProvider';

const FAILURE_NOTIFY_TIME_MS = 1000 * 3;

const Layout = styled.aside`
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
    background-color: var(--color-transparent-panel-background);
    color: var(--color-panel-text);
    transition: opacity .6s linear;
`;

export default function Toast() {
    const {icon, message} = useToast();
    const setToast = useSetToast();
    const ref = useRef<HTMLDivElement>(null);
    useEffect(
        () => {
            if (!message) {
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
                    animation.current?.addEventListener('finish', () => setToast(icon, ''));
                },
                FAILURE_NOTIFY_TIME_MS
            );
            return () => {
                clearTimeout(tick);
                animation.current?.cancel();
            };
        },
        [setToast, icon, message]
    );

    if (!message) {
        return null;
    }

    return (
        <Layout ref={ref}>
            {createElement(icon)}
            <span>{message}</span>
        </Layout>
    );
}

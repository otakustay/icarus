import {createElement, useEffect, useRef} from 'react';
import {IoSkullOutline} from 'react-icons/io5';
import styled from 'styled-components';
import {useGlobalFailure, useSetGlobalFailure} from '../FailureContextProvider';
import knownErrors from './knownErrors';

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
    background-color: #353535;
    color: #fff;
    transition: opacity .6s linear;
`;

export default function FailureToast() {
    const failure = useGlobalFailure();
    const setFailure = useSetGlobalFailure();
    const ref = useRef<HTMLDivElement>(null);
    useEffect(
        () => {
            if (!failure) {
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
                    animation.current?.addEventListener('finish', () => setFailure(null));
                },
                FAILURE_NOTIFY_TIME_MS
            );
            return () => {
                clearTimeout(tick);
                animation.current?.cancel();
            };
        },
        [failure, setFailure]
    );

    if (!failure) {
        return null;
    }

    const formatted = knownErrors(failure) ?? '虽然不知道发生了什么，总之有个错误';
    const [iconType, message] = typeof formatted === 'string' ? [IoSkullOutline, formatted] : formatted;

    return (
        <Layout ref={ref}>
            {createElement(iconType)}
            <span>{message}</span>
        </Layout>
    );
}

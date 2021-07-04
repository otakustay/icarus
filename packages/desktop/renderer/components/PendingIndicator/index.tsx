import styled, {keyframes} from 'styled-components';
import {useRemotePending} from '@/components/RemoteContextProvider';

const loadingKeyframes = keyframes`
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
`;

const Outer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 70;
    height: 4px;
`;

const Inner = styled.div`
    background-image: linear-gradient(
        to right,
        var(--color-primary-element-background),
        var(--color-primary-element-contrast-background)
    );
    height: 100%;
    animation: .5s linear 0s infinite alternate ${loadingKeyframes};
`;

export default function PendingIndicator() {
    const pending = useRemotePending();

    return pending
        ? (
            <Outer>
                <Inner />
            </Outer>
        )
        : null;
}

import styled from '@emotion/styled';
import {keyframes} from '@emotion/react';

const loadingKeyframes = keyframes`
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
`;

const Outer = styled.div`
    height: 4px;
`;

const Inner = styled.div`
    background-image: linear-gradient(
        to right,
        var(--color-vivid-dark),
        var(--color-vivid-light)
    );
    height: 100%;
    animation: .5s linear 0s infinite alternate ${loadingKeyframes};
`;

export interface Props {
    className?: string;
}

export default function Loading({className}: Props) {
    return (
        <Outer className={className}>
            <Inner />
        </Outer>
    );
}

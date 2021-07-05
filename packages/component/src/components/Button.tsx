import {ReactNode} from 'react';
import styled from 'styled-components';
import InteractiveElement from './InteractiveElement';

const ButtonWrapper = styled(InteractiveElement)`
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 32px;
    font-size: 16px;
    appearance: none;
    border: 0;
    outline: 0;
    border-radius: 8px;
    cursor: pointer;
`;

export interface Props {
    type?: 'primary' | 'default';
    children: ReactNode;
    onClick?: () => void;
}

export default function Button({type = 'default', children, onClick}: Props) {
    return (
        <ButtonWrapper as="button" themeType={type} onClick={onClick}>
            {children}
        </ButtonWrapper>
    );
}

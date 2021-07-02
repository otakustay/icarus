import {ReactNode} from 'react';
import styled from 'styled-components';

interface NativeProps {
    themeType: 'primary' | 'default';
}

interface Props {
    type?: NativeProps['themeType'];
    children: ReactNode;
    onClick: () => void;
}

const COLOR_PRIMARY = '#1d90ff';

const COLOR_CONTRAST = '#43a9ff';

const ButtonWrapper = styled.button<NativeProps>`
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 32px;
    font-size: 16px;
    appearance: none;
    border: 0;
    border: 1px solid ${COLOR_PRIMARY};
    background-color: ${({themeType}: NativeProps) => (themeType === 'primary' ? COLOR_PRIMARY : 'transparent')};
    color: ${({themeType}) => (themeType === 'primary' ? '#fff' : COLOR_PRIMARY)};
    cursor: pointer;

    &:hover {
        border-color: ${COLOR_CONTRAST};
        background-color: ${({themeType}: NativeProps) => (themeType === 'primary' ? COLOR_CONTRAST : 'transparent')};
        color: ${({themeType}) => (themeType === 'primary' ? '#fff' : COLOR_CONTRAST)};
    }
`;

export default function Button({type = 'default', children, onClick}: Props) {
    return (
        <ButtonWrapper type="button" themeType={type} onClick={onClick}>
            {children}
        </ButtonWrapper>
    );
}

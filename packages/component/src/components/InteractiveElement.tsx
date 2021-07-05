import styled from 'styled-components';

type MouseState = 'hover' | 'active';

interface Props {
    themeType?: 'default' | 'primary';
    disabled?: boolean;
}

const backgroundColor = (themeType: Props['themeType'], state?: MouseState) => {
    const typePart = (themeType && themeType === 'primary') ? 'primary' : 'secondary';

    return `var(--color-${typePart}-background${state ? '-' + state : ''})`;
};

const textColor = (themeType: Props['themeType'], state?: MouseState) => {
    const typePart = (themeType && themeType === 'primary') ? 'primary' : 'secondary';

    return `var(--color-${typePart}-text${state ? '-' + state : ''})`;
};

const InteractiveElement = styled.div<Props>`
    background-color: ${({themeType}) => backgroundColor(themeType)};
    color: ${({themeType}) => textColor(themeType)};

    &:hover {
        background-color: ${({themeType, disabled}) => (disabled ? undefined : backgroundColor(themeType, 'hover'))};
        color: ${({themeType, disabled}) => (disabled ? undefined : textColor(themeType, 'hover'))};
    }

    &:active {
        background-color: ${({themeType, disabled}) => (disabled ? undefined : backgroundColor(themeType, 'active'))};
        color: ${({themeType, disabled}) => (disabled ? undefined : textColor(themeType, 'active'))};
    }
`;

export default InteractiveElement;

import styled from 'styled-components';

export interface InputProps {
    bordered?: boolean;
}

const Input = styled.input<InputProps>`
    height: 40px;
    border: 0;
    border: 1px solid transparent;
    padding: 0 16px;
    font-size: 16px;
    border-radius: 0;
    border-bottom-color: var(--color-panel-text-secondary);
    background-color: var(--color-panel-background);
    outline: none;
    color: var(--color-panel-text);

    &:focus,
    &:active {
        border-color: ${({bordered}) => (bordered ? 'var(--color-panel-text)' : 'transparent')};
        border-bottom-color: var(--color-panel-text-hover);
    }
`;

export default Input;

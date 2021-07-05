import styled from 'styled-components';

export interface Props {
    translucent?: boolean;
}

const Panel = styled.div<Props>`
    background-color: ${({translucent}) => `rgba(var(--color-panel-background-rgb), ${translucent ? '.7' : '1'})`};
    color: var(--color-panel-text);
`;

export default Panel;

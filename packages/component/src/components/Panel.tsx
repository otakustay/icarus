import styled from 'styled-components';

interface Props {
    opacity?: boolean;
}

const Panel = styled.div<Props>`
    background-color: ${({opacity}) => `rgba(var(--color-panel-background-value, ${opacity ? '.7' : '1'}))`};
    color: var(--color-panel-text);
`;

export default Panel;

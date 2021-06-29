import styled from 'styled-components';
import DropZone from '@/components/DropZone';
import GlobalStyle from './GlobalStyle';

const Root = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

export default function App() {
    return (
        <>
            <GlobalStyle />
            <Root>
                <DropZone />
            </Root>
        </>
    );
}

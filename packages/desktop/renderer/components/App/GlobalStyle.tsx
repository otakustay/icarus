import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        overflow: hidden;
    }

    @media screen and (min-resolution: 2dppx) {
        body {
            -webkit-font-smoothing: antialiased;
        }
    }
`;

export default GlobalStyle;

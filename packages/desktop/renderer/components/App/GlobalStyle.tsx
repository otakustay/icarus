import {createGlobalStyle} from 'styled-components';

// TODO: 管理全局颜色
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

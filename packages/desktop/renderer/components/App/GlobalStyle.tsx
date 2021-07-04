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

    :root {
        --color-app-background: #000;

        --color-panel-background: #27272f;
        --color-transparent-panel-background: rgba(39, 39, 47, .7);
        --color-panel-text: #cacaca;
        --color-panel-contrast-text: #fff;

        --color-element-background: #32333d;
        --color-element-contrast-background: #373740;
        --color-element-text: #e5e6e8;
        --color-element-contrast-text: #fff;

        --color-active-element-background: #162432;
        --color-active-element-contrast-background: #162432;
        --color-active-element-text: #fff;
        --color-active-element-contrast-text: #fff;

        --color-primary-element-background: #1cb980;
        --color-primary-element-contrast-background: #34efba;
        --color-primary-element-text: #212121;
        --color-primary-element-contrast-text: #212121;
    }
`;

export default GlobalStyle;

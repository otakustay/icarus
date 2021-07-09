import {Global, css} from '@emotion/react';

const globalStyle = css`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        overflow: hidden;
        background-color: var(--color-app-background);
    }

    @media screen and (min-resolution: 2dppx) {
        body {
            -webkit-font-smoothing: antialiased;
        }
    }

    :root {
        --color-app-background: #000;

        --color-panel-background-rgb: 38, 38, 38;
        --color-panel-background: rgb(var(--color-panel-background-rgb));
        --color-panel-text: #f4f4f4;
        --color-panel-text-hover: #fff;
        --color-panel-text-secondary: #c6c6c6;

        --color-secondary-background: #6f6f6f;
        --color-secondary-background-hover: #606060;
        --color-secondary-background-active: #393939;
        --color-secondary-text: #fff;
        --color-secondary-text-hover: #fff;
        --color-secondary-text-active: #fff;

        --color-primary-background: #0fa300;
        --color-primary-background-hover: #077b00;
        --color-primary-background-active: #045601;
        --color-primary-text: #fff;
        --color-primary-text-hover: #fff;
        --color-primary-text-active: #fff;

        --color-vivid-light: #c6de40;
        --color-vivid-dark: #a6d128;
    }
`;

export default function GlobalStyle() {
    return (
        <Global styles={globalStyle} />
    );
}

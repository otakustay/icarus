import styled from '@emotion/styled';
import {Panel, bottomToTopTransition, rightToLeftTransition} from '@icarus/component';

const Layout = styled(Panel)`
    position: fixed;
    z-index: 20;
    display: grid;
    grid-template-rows: 40px 1fr;
    grid-row-gap: 8px;
    overflow: auto;

    @media (orientation: portrait) {
        bottom: 0;
        left: 0;
        right: 0;
        height: 40%;
        ${bottomToTopTransition({name: 'book-tag-list'})}
    }

    @media (orientation: landscape) {
        top: 0;
        bottom: 0;
        right: 0;
        width: 30%;
        ${rightToLeftTransition({name: 'book-tag-list'})}
    }
`;

export default Layout;

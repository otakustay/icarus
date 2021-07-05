import styled from 'styled-components';
import {Panel, bottomToTopTransition, rightToLeftTransition} from '@icarus/component';

const Layout = styled(Panel)`
    position: fixed;
    z-index: 20;
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

import styled from 'styled-components';
import {bottomToTopTransition, rightToLeftTransition} from '@/utils/transition';

const Layout = styled.div`
    position: fixed;
    background-color: var(--color-panel-background);
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

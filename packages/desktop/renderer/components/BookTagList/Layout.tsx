import styled from 'styled-components';
import {bottomToTopTransition, rightToLeftTransition} from '@/utils/transition';

const Layout = styled.div`
    position: fixed;
    background-color: #525252;
    z-index: 20;

    @media (orientation: portrait) {
        bottom: 0;
        left: 0;
        right: 0;
        height: 40%;
        ${bottomToTopTransition()}
    }

    @media (orientation: landscape) {
        top: 0;
        bottom: 0;
        right: 0;
        width: 30%;
        ${rightToLeftTransition()}
    }
`;

export default Layout;

import styled from 'styled-components';
import {createTransition} from '@/utils/transition';

const zoomTransition = createTransition(
    'zoom',
    {
        property: 'transform',
        from: 'translate(-50%, -50%) scale(0)',
        to: 'translate(-50%, -50%) scale(1)',
        duration: 300,
        timingFunction: 'ease-in-out',
        defaultToInvisible: true,
    }
);


const Layout = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    width: 60vw;
    height: 60vh;
    padding: 12px;
    display: grid;
    grid-row-gap: 12px;
    grid-template-rows: 1fr 30px;
    background-color: #525252;
    border-radius: 12px;
    z-index: 30;
    ${zoomTransition}
`;

export default Layout;

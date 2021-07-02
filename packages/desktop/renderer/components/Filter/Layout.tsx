import styled from 'styled-components';

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
    transform: translate(-50%, -50%) scale(0);
    background-color: #525252;
    border-radius: 12px;
    z-index: 30;

    &.filter-enter {
        transform: translate(-50%, -50%) scale(0);
    }

    &.filter-enter-active {
        transform: translate(-50%, -50%) scale(1);
        transition: transform 300ms ease-in-out;
    }

    &.filter-enter-done {
        transform: translate(-50%, -50%) scale(1);
    }

    &.filter-exit {
        transform: translate(-50%, -50%) scale(1);
        transition: transform 300ms ease-in-out;
    }

    &.filter-exit-active {
        transform: translate(-50%, -50%) scale(0);
    }
`;

export default Layout;

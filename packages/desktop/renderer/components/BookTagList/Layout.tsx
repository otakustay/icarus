import styled from 'styled-components';

const Layout = styled.div`
    background-color: #525252;
    font-size: 24px;
    color: #fff;
    position: fixed;
    box-sizing: border-box;

    @media (orientation: portrait) {
        bottom: 0;
        left: 0;
        right: 0;
        height: 40%;
        transform: translateY(100%);

        &.book-tag-list-enter {
            transform: translateY(100%);
        }

        &.book-tag-list-enter-active {
            transform: translateY(0);
            transition: transform 300ms ease-in-out;
        }

        &.book-tag-list-enter-done {
            transform: translateY(0);
        }

        &.book-tag-list-exit {
            transform: translateY(0);
            transition: transform 300ms ease-in-out;
        }

        &.book-tag-list-exit-active {
            transform: translateY(100%);
        }
    }

    @media (orientation: landscape) {
        top: 0;
        bottom: 0;
        right: 0;
        width: 30%;
        transform: translateX(100%);

        &.book-tag-list-enter {
            transform: translateX(100%);
        }

        &.book-tag-list-enter-active {
            transform: translateX(0);
            transition: transform 300ms ease-in-out;
        }

        &.book-tag-list-enter-done {
            transform: translateX(0);
        }

        &.book-tag-list-exit {
            transform: translateX(0);
            transition: transform 300ms ease-in-out;
        }

        &.book-tag-list-exit-active {
            transform: translateX(100%);
        }
    }
`;

export default Layout;

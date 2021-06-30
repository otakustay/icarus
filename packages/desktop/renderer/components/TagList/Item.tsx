import styled from 'styled-components';
import {TagState} from './interface';

interface ActiveProps {
    active: boolean;
}

const Layout = styled.li<ActiveProps>`
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    background-color: ${({active}) => (active ? 'xxx' : '#444')};
    color: #cacaca;
    cursor: default;

    &:hover {
        background-color: #525252;
        color: #fff;
    }
`;

export default function TagItem({name, active}: TagState) {
    return <Layout active={active}>{name}</Layout>;
}

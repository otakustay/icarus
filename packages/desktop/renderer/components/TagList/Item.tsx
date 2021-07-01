import {useCallback} from 'react';
import styled from 'styled-components';
import {TagState} from './interface';

interface ActiveProps {
    active: boolean;
}

const Layout = styled.li<ActiveProps>`
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    background-color: ${({active}) => (active ? '#74a201' : '#444')};
    color: ${({active}) => (active ? '#fff' : '#cacaca')};
    cursor: cursor;

    &:hover {
        background-color: #525252;
        background-color: ${({active}) => (active ? '#abc600' : '#444')};
        color: #fff;
    }
`;

interface Props extends TagState {
    onClick: (name: string) => void;
}

export default function TagItem({name, active, onClick}: Props) {
    const click = useCallback(
        () => onClick(name),
        [name, onClick]
    );

    return <Layout active={active} onClick={click}>{name}</Layout>;
}

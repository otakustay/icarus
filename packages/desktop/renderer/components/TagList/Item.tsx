import {useCallback} from 'react';
import styled from 'styled-components';
import {TagState} from './interface';
import {useTagListDisabled} from './StatusContextProvider';

interface LabelProps {
    active: boolean;
    disabled: boolean;
}

const Layout = styled.li<LabelProps>`
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    background-color: ${({active}) => (active ? '#74a201' : '#444')};
    color: ${({active}) => (active ? '#fff' : '#cacaca')};
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};

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
    const disabled = useTagListDisabled();
    const click = useCallback(
        () => onClick(name),
        [name, onClick]
    );

    return <Layout active={active} disabled={disabled} onClick={disabled ? undefined : click}>{name}</Layout>;
}

import {useCallback} from 'react';
import styled from 'styled-components';
import {TagState} from './interface';
import {useTagListDisabled} from './StatusContextProvider';

interface LabelProps {
    active: boolean;
    suggested: boolean;
    disabled: boolean;
}

const COLOR_DEFAULT = '#444';

const COLOR_ACTIVE = '#74a201';

const COLOR_DEFAULT_CONTRAST = '#525252';

const COLOR_ACTIVE_CONTRAST = '#abc600';

type ColorState = 'default' | 'contrast';

const backgroundColorOf = (state: ColorState) => ({active}: LabelProps) => (
    active
        ? (state === 'default' ? COLOR_ACTIVE : COLOR_ACTIVE_CONTRAST)
        : (state === 'default' ? COLOR_DEFAULT : COLOR_DEFAULT_CONTRAST)
);

const linearColorOf = (state: ColorState) => ({suggested}: LabelProps) => (
    suggested
        ? (state === 'default' ? COLOR_ACTIVE : COLOR_ACTIVE_CONTRAST)
        : 'transparent'
);

const Layout = styled.li<LabelProps>`
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    background-color: ${backgroundColorOf('default')};
    background-image: linear-gradient(
        to top,
        ${linearColorOf('default')},
        ${linearColorOf('default')} 4px,
        transparent 4px
    );
    color: ${({active}) => (active ? '#fff' : '#cacaca')};
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};

    &:hover {
        background-color: ${backgroundColorOf('contrast')};
        background-image: linear-gradient(
            to top,
            ${linearColorOf('contrast')},
            ${linearColorOf('contrast')} 8px,
            transparent 8px
        );
        color: #fff;
    }
`;

interface Props extends TagState {
    onActiveChange: (name: string, active: boolean) => void;
}

export default function TagItem({name, active, suggested, onActiveChange}: Props) {
    const disabled = useTagListDisabled();
    const click = useCallback(
        () => onActiveChange(name, !active),
        [name, active, onActiveChange]
    );

    return (
        <Layout active={active} suggested={suggested} disabled={disabled} onClick={disabled ? undefined : click}>
            {name}
        </Layout>
    );
}

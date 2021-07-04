import {useCallback} from 'react';
import styled from 'styled-components';
import {backgroundColor, textColor, twoStopLinear} from '@/utils/style';
import {TagState} from './interface';
import {useTagListDisabled} from './StatusContextProvider';

interface LabelProps {
    active: boolean;
    suggested: boolean;
    disabled: boolean;
}

const background = (active: boolean, contrast: boolean) => backgroundColor(
    active ? 'primary' : 'default',
    contrast ? 'contrast' : 'default'
);

const linear = (suggested: boolean, contrast: boolean) => twoStopLinear(
    'top',
    4,
    background(suggested, contrast)
);

const text = (active: boolean, contrast: boolean) => textColor(
    active ? 'primary' : 'default',
    contrast ? 'contrast' : 'default'
);

const Layout = styled.li<LabelProps>`
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    background-color: ${({active}) => background(active, false)};
    background-image: ${({active, suggested}) => linear(active || suggested, false)};
    color: ${({active}) => text(active, false)};
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};

    &:hover {
        background-color: ${({active}) => background(active, true)};
        background-image: ${({active, suggested}) => linear(active || suggested, true)};
        color: ${({active}) => text(active, true)};
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

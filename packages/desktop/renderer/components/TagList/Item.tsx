import {useCallback} from 'react';
import {Tag} from '@icarus/component';
import {TagState} from './interface';
import {useTagListDisabled} from './StatusContextProvider';

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
        <Tag active={active} suggested={suggested} disabled={disabled} onClick={disabled ? undefined : click}>
            {name}
        </Tag>
    );
}

import {useCallback, KeyboardEvent} from 'react';
import styled from 'styled-components';
import {Input} from '@icarus/component';

const TagInput = styled(Input)`
    width: 100%;
`;

interface Props {
    onSubmit: (value: string) => void;
}

export default function NewTagInput({onSubmit}: Props) {
    const keyHit = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            const value = target.value.trim();

            if (e.key === 'Enter' && value) {
                target.value = '';
                onSubmit(value);
            }
        },
        [onSubmit]
    );

    return <TagInput placeholder="输入标签名，回车提交" onKeyDown={keyHit} />;
}

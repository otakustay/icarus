import {useState, useCallback} from 'react';
import styled from 'styled-components';
import {ReadingFilter} from '@icarus/shared';
import TagList from '@/components/TagList';
import {useReadingFilter} from '@/components/ReadingContextProvider';
import Submit from './Submit';

const Layout = styled.div`
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100%;
`;

const List = styled(TagList)`
    overflow: auto;
`;

const useSubmit = (selected: string[], onSubmit: (filter: ReadingFilter) => void) => {
    const submit = useCallback(
        () => onSubmit({tagNames: selected}),
        [onSubmit, selected]
    );
    const clear = useCallback(
        async () => onSubmit({tagNames: []}),
        [onSubmit]
    );

    return {submit, clear};
};

interface Props {
    allTagNames: string[];
    showTagEmpty: boolean;
    onSubmit: (filter: ReadingFilter) => void;
}

export default function FilterContent({allTagNames, showTagEmpty, onSubmit}: Props) {
    const readingFilter = useReadingFilter();
    const [selected, setSelected] = useState(readingFilter.tagNames);
    const toggleTagActive = useCallback(
        (tagName: string, active: boolean) => {
            if (active) {
                setSelected(s => [...s, tagName]);
            }
            else {
                setSelected(s => s.filter(v => v !== tagName));
            }
        },
        []
    );
    const {submit, clear} = useSubmit(selected, onSubmit);

    return (
        <Layout>
            <List
                noPadding
                showEmpty={showTagEmpty}
                tagNames={allTagNames}
                activeTagNames={selected}
                onTagActiveChange={toggleTagActive}
            />
            <Submit onSubmit={submit} onClear={clear} />
        </Layout>
    );
}

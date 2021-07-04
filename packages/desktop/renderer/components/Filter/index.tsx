import {useCallback} from 'react';
import {ReadingFilter} from '@icarus/shared';
import {useRequest} from '@huse/request';
import {useRemote} from '@/components/RemoteContextProvider';
import {useReadingFilter, useSetReadingContent} from '@/components/ReadingContextProvider';
import Content from './Content';
import {stringifyFilter} from './utils';

const useSubmit = (onComplete: () => void) => {
    const {filter: ipc} = useRemote();
    const setReadingContent = useSetReadingContent();
    const submit = useCallback(
        async (filter: ReadingFilter) => {
            const content = await ipc.applyFilter(filter);
            setReadingContent(content, content.bookNames);
            onComplete();
        },
        [ipc, setReadingContent, onComplete]
    );
    return submit;
};

interface Props {
    onComplete: () => void;
}

export default function Filter({onComplete}: Props) {
    const {tag: ipc} = useRemote();
    const {pending, data: allTagNames = []} = useRequest(ipc.listAll, undefined);
    const readingFilter = useReadingFilter();
    const submitFilter = useSubmit(onComplete);

    return (
        <Content
            key={stringifyFilter(readingFilter)}
            allTagNames={allTagNames}
            showTagEmpty={!pending}
            onSubmit={submitFilter}
        />
    );
}

import {useCallback} from 'react';
import {CSSTransition} from 'react-transition-group';
import {ReadingFilter} from '@icarus/shared';
import {useRequest} from '@huse/request';
import {useRemote} from '@/components/RemoteContextProvider';
import {useFilterVisible, useToggleFilter} from '@/components/ReadingLayoutContextProvider';
import {useReadingFilter, useSetReadingContent} from '@/components/ReadingContextProvider';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_TOGGLE_FILTER} from '@/dicts/keyboard';
import Layout from './Layout';
import Content from './Content';
import {stringifyFilter} from './utils';

const useFilter = () => {
    const toggleFilter = useToggleFilter();
    useGlobalShortcut(KEY_TOGGLE_FILTER, toggleFilter);
};

const useSubmit = () => {
    const {filter: ipc} = useRemote();
    const setReadingContent = useSetReadingContent();
    const toggleFitler = useToggleFilter();
    const submit = useCallback(
        async (filter: ReadingFilter) => {
            const content = await ipc.applyFilter(filter);
            setReadingContent(content, content.bookNames);
            toggleFitler(false);
        },
        [ipc, setReadingContent, toggleFitler]
    );
    return submit;
};

export default function Filter() {
    useFilter();
    const {tag: ipc} = useRemote();
    const {pending, data: allTagNames = []} = useRequest(ipc.listAll, undefined);
    const filterVisible = useFilterVisible();
    const readingFilter = useReadingFilter();
    const submitFilter = useSubmit();

    return (
        <CSSTransition mountOnEnter in={filterVisible} timeout={300} classNames="zoom">
            <Layout>
                <Content
                    key={stringifyFilter(readingFilter)}
                    allTagNames={allTagNames}
                    showTagEmpty={!pending}
                    onSubmit={submitFilter}
                />
            </Layout>
        </CSSTransition>
    );
}

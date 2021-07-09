import {useCallback, useRef} from 'react';
import {CSSTransition} from 'react-transition-group';
import {useClickOutside} from '@huse/click-outside';
import {useReadingBookUnsafe} from '@/components/ReadingContextProvider';
import TagList from '@/components/TagList';
import {useTagListVisible, useToggleTagList} from '@/components/ReadingLayoutContextProvider';
import {useBookTagData, useSuggestedTagNames, useToggleTagActive} from './hooks';
import Layout from './Layout';
import NewInput from './NewInput';

interface Props {
    disabled: boolean;
}

export default function BookTagList({disabled}: Props) {
    const tagListVisible = useTagListVisible();
    const setTagListVisible = useToggleTagList();
    const book = useReadingBookUnsafe();
    const ref = useRef<HTMLDivElement>(null);
    const [{allTagNames, activeTagNames}, reloadTagData, pending] = useBookTagData(book?.name);
    const [suggestedTagNames, reloadSuggestedTagNames] = useSuggestedTagNames(book?.name);
    const reloadAfterTagUpdate = useCallback(
        () => {
            reloadTagData();
            reloadSuggestedTagNames();
        },
        [reloadSuggestedTagNames, reloadTagData]
    );
    const toggleTagActive = useToggleTagActive(book?.name, reloadAfterTagUpdate);
    const attachNewTag = useCallback(
        (tagName: string) => toggleTagActive(tagName, true),
        [toggleTagActive]
    );
    useClickOutside(ref, () => setTagListVisible(false));

    return (
        <CSSTransition nodeRef={ref} in={tagListVisible} timeout={300} classNames="book-tag-list">
            <Layout ref={ref}>
                <NewInput onSubmit={attachNewTag} />
                <TagList
                    disabled={disabled}
                    showEmpty={!pending}
                    tagNames={allTagNames}
                    activeTagNames={activeTagNames}
                    suggestedTagNames={suggestedTagNames}
                    onTagActiveChange={toggleTagActive}
                />
            </Layout>
        </CSSTransition>
    );
}

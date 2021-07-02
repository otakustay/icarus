import {useRef} from 'react';
import {CSSTransition} from 'react-transition-group';
import {useClickOutside} from '@huse/click-outside';
import {useReadingBookUnsafe} from '@/components/ReadingContextProvider';
import TagList from '@/components/TagList';
import {useTagListVisible, useToggleTagList} from '@/components/ReadingLayoutContextProvider';
import {useBookTagData, useToggleTagActive} from './hooks';
import Layout from './Layout';

// TODO: 标签推荐功能
// TODO: 新建标签

interface Props {
    disabled: boolean;
}

export default function BookTagList({disabled}: Props) {
    const tagListVisible = useTagListVisible();
    const setTagListVisible = useToggleTagList();
    const book = useReadingBookUnsafe();
    const ref = useRef<HTMLDivElement>(null);
    const [{allTagNames, activeTagNames}, reloadTagData, pending] = useBookTagData(book?.name);
    const toggleTagActive = useToggleTagActive(book?.name, reloadTagData);
    useClickOutside(ref, () => setTagListVisible(false));

    return (
        <CSSTransition in={tagListVisible} timeout={300} classNames="book-tag-list">
            <Layout ref={ref}>
                <TagList
                    disabled={disabled}
                    showEmpty={!pending}
                    tagNames={allTagNames}
                    activeTagNames={activeTagNames}
                    onTagActiveChange={toggleTagActive}
                />
            </Layout>
        </CSSTransition>
    );
}

import {ReactNode} from 'react';
import styled from 'styled-components';
import TagList from '@/components/TagList';
import {useTagListVisible, useToggleTagList} from '@/components/ReadingLayoutContextProvider';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_TOGGLE_TAG_LIST} from '@/dicts/keyboard';

interface LayoutProps {
    tagListVisible: boolean;
}

const Grid = styled.div<LayoutProps>`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: ${({tagListVisible}) => (tagListVisible ? '1fr 30%' : '1fr')};
    width: 100%;
    height: 100%;
`;

interface Props {
    children: ReactNode;
    isBookReadable: boolean;
}

export default function BookLayout({children, isBookReadable}: Props) {
    const tagListVisible = useTagListVisible();
    const toggleTagList = useToggleTagList();
    useGlobalShortcut(KEY_TOGGLE_TAG_LIST, toggleTagList);

    return (
        <Grid tagListVisible={tagListVisible}>
            {children}
            {tagListVisible && <TagList disabled={!isBookReadable} />}
        </Grid>
    );
}

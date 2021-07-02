import {ReactNode} from 'react';
import styled from 'styled-components';
import {IoTimerOutline} from 'react-icons/io5';
import TagList from '@/components/TagList';
import {useTagListVisible, useTimingStart, useToggleTagList} from '@/components/ReadingLayoutContextProvider';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_DISPLAY_TIMING, KEY_TOGGLE_TAG_LIST} from '@/dicts/keyboard';
import {formatDuration} from '@/utils/time';
import {useSetToast} from '../ToastContextProvider';

const useTagList = () => {
    const tagListVisible = useTagListVisible();
    const toggleTagList = useToggleTagList();
    useGlobalShortcut(KEY_TOGGLE_TAG_LIST, toggleTagList);
    return tagListVisible;
};

const useTiming = () => {
    const setToast = useSetToast();
    const timingStart = useTimingStart();
    useGlobalShortcut(
        KEY_DISPLAY_TIMING,
        () => {
            const duration = Date.now() - timingStart;
            if (duration >= 1000 * 30) {
                const message = `计时 ${formatDuration(duration)}`;
                setToast(IoTimerOutline, message);
            }
        }
    );
};

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
    const tagListVisible = useTagList();
    useTiming();

    return (
        <Grid tagListVisible={tagListVisible}>
            {children}
            {tagListVisible && <TagList disabled={!isBookReadable} />}
        </Grid>
    );
}

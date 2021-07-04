import {ReactNode} from 'react';
import {IoTimerOutline} from 'react-icons/io5';
import BookTagList from '@/components/BookTagList';
import {useSetLayoutType} from '@/components/ReadingContextProvider';
import {useTimingStart, useToggleTagList} from '@/components/ReadingLayoutContextProvider';
import {useSetToast} from '@/components/ToastContextProvider';
import CenterPanel from '@/components/CenterPanel';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_DISPLAY_TIMING, KEY_LAYOUT_ONE_STEP, KEY_LAYOUT_TOP_BOTTOM, KEY_TOGGLE_TAG_LIST} from '@/dicts/keyboard';
import {formatDuration} from '@/utils/time';

const useTagList = () => {
    const toggleTagList = useToggleTagList();
    useGlobalShortcut(KEY_TOGGLE_TAG_LIST, toggleTagList);
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
    const setLayoutType = useSetLayoutType();
    useGlobalShortcut(KEY_LAYOUT_TOP_BOTTOM, () => setLayoutType('topBottom'));
    useGlobalShortcut(KEY_LAYOUT_ONE_STEP, () => setLayoutType('oneStep'));
};

interface Props {
    children: ReactNode;
    isBookReadable: boolean;
}

export default function BookLayout({children, isBookReadable}: Props) {
    useTagList();
    useTiming();

    return (
        <>
            {children}
            <BookTagList disabled={!isBookReadable} />
            <CenterPanel />
        </>
    );
}

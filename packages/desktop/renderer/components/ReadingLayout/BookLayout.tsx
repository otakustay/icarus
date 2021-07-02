import {ReactNode} from 'react';
import {IoTimerOutline} from 'react-icons/io5';
import BookTagList from '@/components/BookTagList';
import {useTimingStart, useToggleTagList} from '@/components/ReadingLayoutContextProvider';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_DISPLAY_TIMING, KEY_TOGGLE_TAG_LIST} from '@/dicts/keyboard';
import {formatDuration} from '@/utils/time';
import {useSetToast} from '../ToastContextProvider';

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
        </>
    );
}

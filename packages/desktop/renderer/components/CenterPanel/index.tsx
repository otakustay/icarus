import {
    useCenterContent,
    useCenterPanelVisible,
    useCloseCenterPanel,
    useToggleBookList,
    useToggleFilter,
    useToggleHelp,
} from '@/components/ReadingLayoutContextProvider';
import Filter from '@/components/Filter';
import BookSelect from '@/components/BookSelect';
import Help from '@/components/Help';
import {CenterContent} from '@/interface/layout';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_TOGGLE_BOOK_LIST, KEY_TOGGLE_FILTER, KEY_TOGGLE_HELP} from '@/dicts/keyboard';
import Panel from './Panel';

const renderTitle = (contentType: CenterContent) => {
    switch (contentType) {
        case 'filter':
            return '筛选漫画';
        case 'bookList':
            return '切换漫画';
        case 'help':
            return '如何使用';
        default:
            return 'Icarus - 小薄本';
    }
};

const renderContent = (contentType: CenterContent, onComplete: () => void) => {
    switch (contentType) {
        case 'filter':
            return <Filter onComplete={onComplete} />;
        case 'bookList':
            return <BookSelect onComplete={onComplete} />;
        case 'help':
            return <Help />;
        default:
            return null;
    }
};

const useShortcuts = () => {
    const toggleFilter = useToggleFilter();
    useGlobalShortcut(KEY_TOGGLE_FILTER, toggleFilter);
    const toggleBookList = useToggleBookList();
    useGlobalShortcut(KEY_TOGGLE_BOOK_LIST, toggleBookList);
    const toggleHelp = useToggleHelp();
    useGlobalShortcut(KEY_TOGGLE_HELP, toggleHelp);
};

export default function CenterPanelContent() {
    const visible = useCenterPanelVisible();
    const centerContent = useCenterContent();
    const close = useCloseCenterPanel();
    useShortcuts();

    return (
        <Panel visible={visible} title={renderTitle(centerContent)} onClose={close}>
            {renderContent(centerContent, close)}
        </Panel>
    );
}

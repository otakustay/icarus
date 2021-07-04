import {
    useCenterContent,
    useCenterPanelVisible,
    useCloseCenterPanel,
    useToggleFilter,
} from '@/components/ReadingLayoutContextProvider';
import Filter from '@/components/Filter';
import BookSelect from '@/components/BookSelect';
import {CenterContent} from '@/interface/layout';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_TOGGLE_FILTER} from '@/dicts/keyboard';
import Panel from './Panel';

const renderTitle = (contentType: CenterContent) => {
    switch (contentType) {
        case 'filter':
            return '筛选漫画';
        case 'bookList':
            return '切换漫画';
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
        default:
            return null;
    }
};

const useShortcuts = () => {
    const toggleFilter = useToggleFilter();
    useGlobalShortcut(KEY_TOGGLE_FILTER, toggleFilter);
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

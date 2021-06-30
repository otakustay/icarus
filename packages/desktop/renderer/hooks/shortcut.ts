import {useDocumentEvent} from '@huse/document-event';

export const useGlobalShortcut = (keys: string[], handler: () => void) => {
    const keysSet = new Set(keys.map(v => v.toLowerCase()));
    useDocumentEvent(
        'keyup',
        e => {
            if ((e.target as HTMLElement).nodeName === 'INPUT') {
                return;
            }

            if (keysSet.has(e.key.toLowerCase())) {
                handler();
            }
        }
    );
};

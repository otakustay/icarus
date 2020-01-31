import {useLayoutEffect} from 'react';

export default function useDocumentEvent<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (this: Document, ev: DocumentEventMap[K]) => any
) {
    useLayoutEffect(
        () => {
            document.addEventListener(eventName, handler);
            return () => document.removeEventListener(eventName, handler);
        },
        [eventName, handler]
    );
}

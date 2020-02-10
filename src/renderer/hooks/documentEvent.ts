import {useRef, useLayoutEffect} from 'react';

export default function useDocumentEvent<K extends keyof DocumentEventMap>(
    eventName: K,
    fn: (ev: DocumentEventMap[K]) => any
) {
    const handler = useRef(fn);
    handler.current = fn;
    useLayoutEffect(
        () => {
            const trigger = (e: DocumentEventMap[K]) => handler.current(e);
            document.addEventListener(eventName, trigger);
            return () => document.removeEventListener(eventName, trigger);
        },
        [eventName, handler]
    );
}

import {useEffect, useState, useRef, useCallback} from 'react';
import {useCounter} from '@huse/number';
import {useRemote} from '@/components/RemoteContextProvider';

export interface BookTagData {
    allTagNames: string[];
    activeTagNames: string[];
}

export const useBookTagData = (bookName: string | undefined): [BookTagData, () => Promise<void>, boolean] => {
    const [pendingCount, {inc: startRequest, dec: endRequest}] = useCounter();
    const latestBookNameRef = useRef(bookName);
    const [allTagNames, setAllTagNames] = useState<string[]>([]);
    const [activeTagNames, setActiveTagNames] = useState<string[]>([]);
    const {tag: ipc} = useRemote();
    const request = useCallback(
        async () => {
            latestBookNameRef.current = bookName;
            const listActive = () => (bookName ? ipc.tagsByBook(bookName) : Promise.resolve([]));
            startRequest();
            try {
                const [activeTagNames, allTagNames] = await Promise.all([listActive(), ipc.listAll()]);
                if (bookName === latestBookNameRef.current) {
                    setAllTagNames(allTagNames);
                    setActiveTagNames(activeTagNames);
                }
            }
            catch {
                endRequest();
            }
        },
        [bookName, endRequest, ipc, startRequest]
    );
    useEffect(
        () => {
            request();
        },
        [request]
    );

    return [
        {allTagNames, activeTagNames},
        request,
        !!pendingCount,
    ];
};

export const useToggleTagActive = (bookName: string | undefined, onComplete: () => Promise<void>) => {
    const {tag: ipc} = useRemote();
    const toggleTagActive = useCallback(
        async (tagName: string, active: boolean) => {
            if (bookName) {
                await ipc.applyToBook({bookName, tagName, active});
                await onComplete();
            }
        },
        [bookName, ipc, onComplete]
    );
    return toggleTagActive;
};

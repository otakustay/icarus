import {useEffect, useState, useRef, useCallback} from 'react';
import {useCounter} from '@huse/number';
import {useRemote} from '@/components/RemoteContextProvider';

export interface BookTagData {
    allTagNames: string[];
    activeTagNames: string[];
}

export const useBookTagData = (bookName: string | undefined): [BookTagData, () => void, boolean] => {
    const [pendingCount, {inc: startRequest, dec: endRequest}] = useCounter();
    const latestBookNameRef = useRef(bookName);
    const [allTagNames, setAllTagNames] = useState<string[]>([]);
    const [activeTagNames, setActiveTagNames] = useState<string[]>([]);
    const {tag: ipc} = useRemote();
    const request = useCallback(
        async () => {
            // 换本子的时候把选中的去掉。但这里不能把所有标签给干掉，不然标签列表会有闪烁
            if (bookName !== latestBookNameRef.current) {
                setActiveTagNames([]);
            }

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
            finally {
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

export const useToggleTagActive = (bookName: string | undefined, onComplete: () => void) => {
    const {tag: ipc} = useRemote();
    const toggleTagActive = useCallback(
        async (tagName: string, active: boolean) => {
            if (bookName) {
                await ipc.applyToBook({bookName, tagName, active});
                onComplete();
            }
        },
        [bookName, ipc, onComplete]
    );
    return toggleTagActive;
};

export const useSuggestedTagNames = (bookName: string | undefined): [string[], () => void] => {
    const latestBookNameRef = useRef(bookName);
    const [suggestedTagNames, setSuggestedTagNames] = useState<string[]>([]);
    const {tag: ipc} = useRemote();
    const request = useCallback(
        async () => {
            // 换本子的时候把推荐的去掉
            if (bookName !== latestBookNameRef.current) {
                setSuggestedTagNames([]);
            }

            latestBookNameRef.current = bookName;
            const listSuggested = () => (bookName ? ipc.suggestTags(bookName) : Promise.resolve([]));
            const suggestedTagNames = await listSuggested();
            if (bookName === latestBookNameRef.current) {
                setSuggestedTagNames(suggestedTagNames);
            }
        },
        [bookName, ipc]
    );
    useEffect(
        () => {
            request();
        },
        [request]
    );

    return [suggestedTagNames, request];
};

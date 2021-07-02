import {useEffect, useState, useRef, useCallback} from 'react';
import * as R from 'ramda';
import {useCounter} from '@huse/number';
import {useRemote} from '@/components/RemoteContextProvider';

export interface BookTagData {
    allTagNames: string[];
    activeTagNames: Set<string>;
}

export const useBookTagData = (bookName: string | undefined): [BookTagData, () => Promise<void>, boolean] => {
    const [pendingCount, {inc: startRequest, dec: endRequest}] = useCounter();
    const latestBookNameRef = useRef(bookName);
    const [allTagNames, setAllTagNames] = useState<string[]>([]);
    const [activeTagNames, setActiveTagNames] = useState(new Set<string>());
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
                    setActiveTagNames(new Set(activeTagNames));
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

const EMPTY_SET = new Set<string>();

interface ToggleOptions {
    active?: Set<string>;
    onComplete?: () => Promise<void>;
}

export const useToggleTagActive = (bookName: string | undefined, options: ToggleOptions = {}) => {
    const {active = EMPTY_SET, onComplete = R.always(undefined)} = options;
    const {tag: ipc} = useRemote();
    const toggleTagActive = useCallback(
        async (name: string) => {
            if (bookName) {
                await ipc.applyToBook({bookName: bookName, tagName: name, active: !active.has(name)});
                await onComplete();
            }
        },
        [active, bookName, ipc, onComplete]
    );
    return toggleTagActive;
};

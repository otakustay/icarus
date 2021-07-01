import {useState, useMemo, useContext, createContext, ReactNode} from 'react';
import {useIntendedLazyValue} from '@huse/intended-lazy';
import open from '@/ipc/open';
import navigate from '@/ipc/navigate';
import tag from '@/ipc/tag';
import {wrapToNotifyPending} from './utils';

interface RemoteContextValue {
    open: typeof open;
    navigate: typeof navigate;
    tag: typeof tag;
}

const DEFAULT_VALUE: RemoteContextValue = {
    open,
    navigate,
    tag,
};

const RemotePendingContext = createContext(false);
RemotePendingContext.displayName = 'RemotePendingContext';

const RemoteContext = createContext(DEFAULT_VALUE);
RemoteContext.displayName = 'RemoteContext';

interface Props {
    children: ReactNode;
}

export default function RemoteContextProvider({children}: Props) {
    const [pending, setPending] = useState(false);
    const readPending = useIntendedLazyValue(pending);
    const remote = useMemo(
        () => {
            const state = {
                get: readPending,
                set: setPending,
            };
            const wrapped: RemoteContextValue = {
                tag,
                open: wrapToNotifyPending('open', open, state),
                navigate: wrapToNotifyPending('navigate', navigate, state),
            };
            return wrapped;
        },
        [readPending]
    );

    return (
        <RemoteContext.Provider value={remote}>
            <RemotePendingContext.Provider value={pending}>
                {children}
            </RemotePendingContext.Provider>
        </RemoteContext.Provider>
    );
}

export const useRemotePending = () => useContext(RemotePendingContext);

export const useRemote = () => useContext(RemoteContext);

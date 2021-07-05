import {createElement, useCallback} from 'react';
import {Toast as BaseToast} from '@icarus/component';
import {useToast, useSetToast} from '@/components/ToastContextProvider';

export default function Toast() {
    const {icon, message} = useToast();
    const setToast = useSetToast();
    const exit = useCallback(
        () => setToast(icon, ''),
        [icon, setToast]
    );

    if (!message) {
        return null;
    }

    return (
        <BaseToast icon={createElement(icon)} onExit={exit}>
            {message}
        </BaseToast>
    );
}

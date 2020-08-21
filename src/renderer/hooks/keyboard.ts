import {matches} from 'lodash';
import {useRef, useMemo, useCallback} from 'react';
import useDocumentEvent from './documentEvent';

const CONTROL = 17;
const ALT = 18;
const CMD = 91;
const META = 224;
const HELPER_KEYS = new Set([CONTROL, ALT, CMD, META]);

const isSingleKey = matches({altKey: false, ctrlKey: false, metaKey: false});

interface KeyPattern {
    altKey: boolean;
    keyCode: number;
}

const parseKeyPattern = (pattern: string): KeyPattern => {
    const names = pattern.split('+');
    return {
        altKey: names.includes('ALT'),
        keyCode: names[names.length - 1].charCodeAt(0),
    };
};

export default function useKeyboard(pattern: string, handler: () => void) {
    const isInHelperMode = useRef(false);
    const isMatch = useMemo(
        () => matches(parseKeyPattern(pattern)),
        [pattern]
    );
    const down = useCallback(
        ({keyCode}) => {
            if (HELPER_KEYS.has(keyCode)) {
                isInHelperMode.current = true;
            }
        },
        []
    );
    useDocumentEvent('keydown', down);
    const up = useCallback(
        (e: KeyboardEvent) => {
            const {keyCode, target} = e;

            if ((target as HTMLElement).nodeName === 'INPUT') {
                return;
            }

            if (HELPER_KEYS.has(keyCode)) {
                isInHelperMode.current = false;
                return;
            }

            if (isInHelperMode.current && isSingleKey(e)) {
                return;
            }

            if (isMatch(e)) {
                handler();
            }
        },
        [isMatch, handler]
    );
    useDocumentEvent('keyup', up);
}

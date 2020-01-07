import {last, matches} from 'lodash';
import {useRef, useMemo} from 'react';
import useDocumentEvent from './documentEvent';

const CONTROL = 17;
const ALT = 18;
const CMD = 91;
const META = 224;
const HELPER_KEYS = new Set([CONTROL, ALT, CMD, META]);

const isSingleKey = matches({altKey: false, ctrlKey: false, metaKey: false});

const parseKeyPattern = pattern => {
    const names = pattern.split('+');
    return {
        altKey: names.includes('ALT'),
        keyCode: last(names).charCodeAt(0),
    };
};

export default (pattern, handler) => {
    const isInHelperMode = useRef(false);
    const isMatch = useMemo(
        () => matches(parseKeyPattern(pattern)),
        [pattern]
    );
    useDocumentEvent(
        'keydown',
        ({keyCode}) => {
            if (HELPER_KEYS.has(keyCode)) {
                isInHelperMode.current = true;
            }
        },
        []
    );
    useDocumentEvent(
        'keyup',
        e => {
            const {keyCode} = e;

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
};

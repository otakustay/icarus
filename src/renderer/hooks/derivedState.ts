import {useState} from 'react';
import usePreviousValue from './previousValue';

export default function useDerivedState<S, I>(input: I, compute: (v: I) => S): [S, React.Dispatch<S>] {
    const [value, setValue] = useState(() => compute(input));
    const previousValue = usePreviousValue(input);
    if (previousValue !== input) {
        setValue(compute(input));
    }
    return [value, setValue];
}

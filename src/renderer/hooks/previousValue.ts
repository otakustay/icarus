import {useRef} from 'react';

export default function usePreviousValue<T>(value: T, initialValue: T | null = null): T | null {
    const cache = useRef<T | null>(initialValue);
    const previousValue = cache.current;
    cache.current = value;

    return previousValue;
}

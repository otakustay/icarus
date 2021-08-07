type Async<K, T> = (key: K) => Promise<T>;

interface Container<K, T> {
    key: K;
    value: T;
}

export default <K, T extends Exclude<any, symbol>>(factory: Async<K, T>, capacity: number = 1): Async<K, T> => {
    const cache: Array<Container<K, Promise<T>>> = [];

    return async (key: K): Promise<T> => {
        const cached = cache.find(v => v.key === key);

        if (cached) {
            return cached.value;
        }

        const value = factory(key);

        if (cache.length === capacity) {
            cache.shift();
        }
        cache.push({key, value});
        return value;
    };
};

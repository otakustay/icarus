const EMPTY = Symbol('LazyEmpty');

interface Container<K, T> {
    key: K | typeof EMPTY;
    value: T | typeof EMPTY;
}

export default <K, T extends Exclude<any, symbol>>(factory: (key: K) => Promise<T>): (key: K) => Promise<T> => {
    const container: Container<K, T> = {key: EMPTY, value: EMPTY};

    return async (key: K): Promise<T> => {
        if (container.value === EMPTY || container.key !== key) {
            const value = await factory(key);
            container.key = key;
            container.value = value;
        }
        return container.value;
    };
};

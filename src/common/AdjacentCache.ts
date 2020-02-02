interface CacheItem<T> {
    key: string;
    value: T;
}

export default class AdjacentCache<T> {
    previous?: CacheItem<T>;
    current?: CacheItem<T>;
    next?: CacheItem<T>;

    setCurrent(key: string, value: T): void {
        this.previous = undefined;
        this.current = {key, value};
        this.next = undefined;
    }

    cachePrevious(currentKey: string, key: string, value: T): boolean {
        if (this.isCurrentMatch(currentKey)) {
            this.previous = {key, value};
            return true;
        }

        return false;
    }

    cacheNext(currentKey: string, key: string, value: T): boolean {
        if (this.isCurrentMatch(currentKey)) {
            this.next = {key, value};
            return true;
        }

        return false;
    }

    moveToNext(): T | undefined {
        this.previous = this.current;
        this.current = this.next;
        this.next = undefined;
        return this.current?.value;
    }

    moveToPrevious(): T | undefined {
        this.next = this.current;
        this.current = this.previous;
        this.previous = undefined;
        return this.current?.value;
    }

    private isCurrentMatch(key: string): boolean {
        return this.current?.key === key;
    }
}

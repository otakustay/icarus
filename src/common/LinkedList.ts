import {LinkedList} from '../types';

export default class DefaultLinkedList<T> implements LinkedList<T> {

    private readonly list: T[] = [];
    private cursor: number = -1;

    constructor(list: T[]) {
        this.list = list;
        this.cursor = -1;
    }

    current(): T {
        return this.list[this.cursor];
    }

    currentIndex(): number {
        return this.cursor;
    }

    next(): T | null {
        if (this.cursor >= this.list.length - 1) {
            return null;
        }

        this.cursor++;
        return this.current();
    }

    previous(): T | null {
        if (this.cursor <= 0) {
            return null;
        }

        this.cursor--;
        return this.current();
    }

    readyFor(element?: T | null): void {
        this.cursor = element ? this.list.indexOf(element) - 1 : -1;
    }

    size(): number {
        return this.list.length;
    }

    toArray(): T[] {
        return Array.from(this.list);
    }
}

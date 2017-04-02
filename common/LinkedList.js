const CURSOR = Symbol('cursor');
const LIST = Symbol('list');

export default class LinkedList {

    constructor(list) {
        this[LIST] = list;
        this[CURSOR] = -1;
    }

    current() {
        return this[LIST][this[CURSOR]];
    }

    next() {
        if (this[CURSOR] >= this[LIST].length - 1) {
            return null;
        }

        this[CURSOR]++;
        return this.current();
    }

    previous() {
        if (this[CURSOR] <= 0) {
            return null;
        }

        this[CURSOR]--;
        return this.current();
    }

    readyFor(element) {
        this[CURSOR] = element ? this[LIST].indexOf(element) - 1 : -1;
    }

    toArray() {
        return Array.from(this[LIST]);
    }
}

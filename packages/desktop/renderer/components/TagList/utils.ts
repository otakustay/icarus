import * as R from 'ramda';
import {extractPinYiInitialLetter} from '@/utils/pinYin';

const extractLetter = (tagName: string) => {
    const letter = extractPinYiInitialLetter(tagName);
    return letter && /[a-zA-Z]/.test(letter) ? letter.toUpperCase() : '*';
};

const compareLetter = (x: string, y: string) => {
    if (x === '*') {
        return 1;
    }
    if (y === '*') {
        return -1;
    }

    return x.charCodeAt(0) - y.charCodeAt(0);
};

export interface TagGroup {
    letter: string;
    tagNames: string[];
}

export const groupTagsByLetter = (tagNames: string[]): TagGroup[] => {
    const groups = R.groupBy(extractLetter, tagNames);
    return Object.entries(groups)
        .map(([letter, tagNames]) => ({letter, tagNames}))
        .sort((x, y) => compareLetter(x.letter, y.letter));
};

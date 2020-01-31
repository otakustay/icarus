import {removeTone} from 'pinyin-utils';
import dictionary from './dictionary';

export const getPinYinPrefix = (input: string): string | undefined => {
    const firstChar = input[0];

    if (/[a-z]/i.test(firstChar)) {
        return firstChar;
    }

    const pinYin = dictionary[firstChar];
    return pinYin ? removeTone(pinYin[0]) : undefined;
};

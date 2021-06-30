import dictionary from './dictionary';

export const extractPinYiInitialLetter = (value: string): string | undefined => {
    const firstChar = value[0];

    if (/[a-z]/i.test(firstChar)) {
        return firstChar;
    }

    return dictionary[firstChar];
};

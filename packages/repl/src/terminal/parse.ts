import split from 'split-string';

export const parseArgs = (input: string) => {
    const args = split(input, {quotes: true, separator: ' '});
    return args.map(v => v.replace(/^"|"$/g, ''));
};

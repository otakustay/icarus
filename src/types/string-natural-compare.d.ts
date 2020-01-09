declare module 'string-natural-compare' {
    interface Options {
        caseInsensitive?: boolean;
    }

    export default function(x: string, y: string, options?: Options): number;
}

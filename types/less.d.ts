/* eslint-disable init-declarations */
declare module '*.less' {
    const content: {
        [className: string]: string;
        (...names: Array<string | null | undefined | {[key: string]: string | boolean}>): string;
    };
    export default content;
}

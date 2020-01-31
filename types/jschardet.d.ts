declare module 'jschardet' {
    export function detect(input: Buffer): {encoding: string, confidence: number};
}

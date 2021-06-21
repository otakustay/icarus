export default interface Extractor {
    readEntryAt(file: string, index: number): Promise<Buffer>;
}

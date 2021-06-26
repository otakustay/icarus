export interface Entry {
    entryName: string;
    contentBuffer: Buffer;
}

export default interface Extractor {
    readEntryAt(file: string, index: number): Promise<Entry>;
}

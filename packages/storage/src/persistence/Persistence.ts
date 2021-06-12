export default interface Persistence {
    open(): Promise<void>;
    close(): Promise<void>;
    read(): Promise<string>;
    write(content: string): Promise<void>;
    clear(): Promise<void>;
}

import {IpcRenderer, IpcMainEvent} from 'electron';
import DataStore, {RemoveOptions} from 'nedb';

export type CommandName = 'open'
    | 'open-multiple'
    | 'next-archive'
    | 'previous-archive'
    | 'next-image'
    | 'previous-image'
    | 'restore'
    | 'add-tag'
    | 'remove-tag'
    | 'init'
    | 'filter';

interface IPCQueue {
    on<TArgs>(channel: CommandName, handler: (event: IpcMainEvent, arg: TArgs) => void): void;
}

interface PromisedDataStore<T> {
    nedb: DataStore;
    remove(query: any, options: RemoveOptions): Promise<number>;
    insert(newDoc: T): Promise<T>;
    findOne(query: any): Promise<T & {_id: string}>;
    find(query: any): Promise<Array<T & {_id: string}>>;
    update(query: any, newDoc: T): Promise<void>;
}

interface CollisionTable {
    [baseTag: string]: {[targetTag: string]: number};
}

interface Storage {
    state: PromisedDataStore<AppState>;
    database: PromisedDataStore<PersistArchiveInfo>;
    cleanup(): Promise<void>;
    saveState(state: AppState): Promise<void>;
    restoreState(): Promise<AppState | null>;
    findArchivesByTags(tags: string[]): Promise<PersistArchiveInfo[]>;
    getArchiveInfo(archive: string): Promise<PersistArchiveInfo>;
    addTag(archiveName: string, tag: string): Promise<void>;
    removeTag(archiveName: string, tag: string): Promise<void>;
    allTags(): Promise<Array<{name: string, count: number}>>;
    tagCollisions(): Promise<CollisionTable>;
}

interface LinkedList<T> {
    current(): T;
    currentIndex(): number;
    next(): T | null;
    previous(): T | null;
    readyFor(element?: T | null): void;
    size(): number;
    toArray(): T[];
}

interface Archive {
    entries: ArchiveEntry[];
    readEntry(entry: ArchiveEntry): Promise<Buffer>;
}

export interface ArchiveBrowsingOptions {
    moveToLast?: boolean;
    moveToImage?: string;
}

interface AppContext {
    readonly ipc: IPCQueue;
    readonly storage: Storage;
    readonly version: string;
    archiveList: LinkedList<string>;
    browsingArchive: Archive;
    imageList: LinkedList<ArchiveEntry>;
    browsingImage: ArchiveEntry;
    filter: {tags: string[]} | null;
    setArchiveList(archiveList: string[], browsingFile?: string): void;
    setImageList(imageList: ArchiveEntry[], browsingImage?: ArchiveEntry): void;
    setBrowsingArchive(archive: Archive, options?: ArchiveBrowsingOptions): void;
    setFilterTags(tags: string[]): void;
    persist(): Promise<void>;
    dispose(): Promise<void>;
}

interface PreviousArchiveCommandArgs {
    moveToLast: boolean;
}

type CommandHandler<TArg = null> = (context: AppContext, sender: IpcRenderer, arg: TArg) => Promise<void>;

interface ArchiveEntry {
    name: string;
    entryName: string;
}

interface ZipArchiveEntry {
    name: string;
    entryName: string;
    originalEntryName: string;
}

interface FilterState {
    tags: string[];
    archive: string;
    image: string;
}

interface AppState {
    archiveList: string[];
    archive: string;
    image: string;
    version: string;
    filter: FilterState | null;
}

interface PersistArchiveInfo {
    archive: string;
    tags: string[];
}

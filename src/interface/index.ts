import {IpcMainEvent, WebContents} from 'electron';
import DataStore, {RemoveOptions} from 'nedb';
import AdjacentCache from '../common/AdjacentCache';
import LinkedList from '../common/LinkedList';
import {BackendImageInfo} from './backend';

export {BackendImageInfo};

export interface Size {
    width: number;
    height: number;
}

export interface ClientArchiveInfo {
    total: number;
    index: number;
    name: string;
    tags: string[];
}

export interface ClientImageInfo {
    uri: string;
    name: string;
    width: number;
    height: number;
}

export interface ClientTagInfo {
    name: string;
    count: number;
}

export interface TagState {
    all: ClientTagInfo[];
    collisions: CollisionTable;
}

export type CommandName = 'open'
    | 'open-multiple'
    | 'move-to-archive'
    | 'next-image'
    | 'previous-image'
    | 'restore'
    | 'add-tag'
    | 'remove-tag'
    | 'init'
    | 'filter';

export interface IPCQueue {
    on<TArgs>(channel: CommandName, handler: (event: IpcMainEvent, arg: TArgs) => void): void;
}

export interface PromisedDataStore<T> {
    nedb: DataStore;
    remove(query: any, options: RemoveOptions): Promise<number>;
    insert(newDoc: T): Promise<T>;
    findOne(query: any): Promise<T & {_id: string}>;
    find(query: any): Promise<Array<T & {_id: string}>>;
    update(query: any, newDoc: T): Promise<void>;
}

export interface CollisionTable {
    [baseTag: string]: {[targetTag: string]: number | undefined} | undefined;
}

export interface Storage {
    state: PromisedDataStore<AppState>;
    database: PromisedDataStore<PersistArchiveInfo>;
    cleanup(): Promise<void>;
    saveState(state: AppState): Promise<void>;
    restoreState(): Promise<AppState | null>;
    findArchivesByTags(tags: string[]): Promise<PersistArchiveInfo[]>;
    getArchiveInfo(archive: string): Promise<PersistArchiveInfo>;
    addTag(archiveName: string, tag: string): Promise<void>;
    removeTag(archiveName: string, tag: string): Promise<void>;
    allTags(): Promise<ClientTagInfo[]>;
    tagCollisions(): Promise<CollisionTable>;
}

export interface Archive {
    entries: ArchiveEntry[];
    readEntry(entry: ArchiveEntry): Promise<Buffer>;
}

export interface ArchiveBrowsingOptions {
    moveToLast?: boolean;
    moveToImage?: string;
}

export interface AppContext {
    readonly ipc: IPCQueue;
    readonly storage: Storage;
    readonly version: string;
    readonly imageCache: AdjacentCache<BackendImageInfo>;
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

export type CommandHandler<TArg = null> = (context: AppContext, sender: WebContents, arg: TArg) => Promise<void>;

export interface ArchiveEntry {
    name: string;
    entryName: string;
}

export interface ZipArchiveEntry {
    name: string;
    entryName: string;
    originalEntryName: string;
}

export interface FilterState {
    tags: string[];
    archive: string;
    image: string;
}

export interface AppState {
    archiveList: string[];
    archive: string;
    image: string;
    version: string;
    filter: FilterState | null;
}

export interface PersistArchiveInfo {
    archive: string;
    tags: string[];
}

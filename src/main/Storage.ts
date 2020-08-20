import path from 'path';
import {promisify} from 'util';
import {omit, pick, countBy, identity} from 'lodash';
import DataStore, {DataStoreOptions} from 'nedb';
import {AppState, PersistArchiveInfo, PromisedDataStore, Storage, CollisionTable} from '../interface';
import {getLogger} from './util/logger';
import {bareName} from './util';

const logger = getLogger('storage');

const datastore = <T>(config: DataStoreOptions): PromisedDataStore<T> => {
    const nedb = new DataStore(config);
    const wrapper = {
        nedb,
        remove: promisify(nedb.remove).bind(nedb),
        insert: promisify(nedb.insert).bind(nedb),
        findOne: promisify(nedb.findOne).bind(nedb),
        find: promisify(nedb.find).bind(nedb),
        update: promisify(nedb.update).bind(nedb),
    };
    return wrapper as unknown as PromisedDataStore<T>;
};

const stateToLog = (state: AppState): string => {
    const log = {
        ...state,
        archiveList: `(...${state.archiveList.length} files)`,
    };
    return JSON.stringify(log);
};

export default class DefaultStorage implements Storage {

    readonly state: PromisedDataStore<AppState>;

    readonly database: PromisedDataStore<PersistArchiveInfo>;

    constructor(databaseDirectory: string, storageDirectory: string) {
        this.state = datastore({filename: path.join(storageDirectory, 'state.db'), autoload: true});
        this.database = datastore({filename: path.join(databaseDirectory, 'main.db'), autoload: true});

        const interval = 1000 * 60 * 5;
        this.state.nedb.persistence.setAutocompactionInterval(interval);
        this.database.nedb.persistence.setAutocompactionInterval(interval);
    }

    async cleanup(): Promise<void> {
        logger.info('Compact database');

        this.state.nedb.persistence.compactDatafile();
        this.database.nedb.persistence.compactDatafile();

        const tasks = [
            new Promise(resolve => this.state.nedb.on('compaction.done', resolve)),
            new Promise(resolve => this.database.nedb.on('compaction.done', resolve)),
        ];

        await Promise.all(tasks);

        logger.info('Compact database complete');
    }

    async saveState(state: AppState): Promise<void> {
        logger.info('Save state', stateToLog(state));

        try {
            await this.state.remove({}, {multi: true});
            await this.state.insert(state);
        }
        catch (ex) {
            logger.error(ex);
        }
    }

    async restoreState(): Promise<AppState | null> {
        const state = await this.state.findOne({});

        if (state) {
            logger.info(`Previously saved state is: ${stateToLog(state)}`);
            return state;
        }

        logger.info('No saved state');
        return null;
    }

    async findArchivesByTags(tags: string[]): Promise<PersistArchiveInfo[]> {
        const docs = await this.database.find({tags: {$in: tags}});
        return docs.filter(doc => tags.every(tag => doc.tags.includes(tag)));
    }

    async getArchiveInfo(archive: string): Promise<PersistArchiveInfo> {
        const archiveName = bareName(archive);
        const doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            return omit(doc, '_id');
        }

        return {
            archive: archiveName,
            tags: [],
        };
    }

    async addTag(archiveName: string, tag: string): Promise<void> {
        const doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            logger.silly(`Archive info ${archiveName} already exists, updte it`);

            const tags = new Set(doc.tags);
            tags.add(tag);
            doc.tags = Array.from(tags);
            await this.database.update(pick(doc, '_id'), doc);
        }
        else {
            logger.silly(`No archive info for ${archiveName}, insert new`);

            const newDoc = {
                archive: archiveName,
                tags: [tag],
            };
            await this.database.insert(newDoc);
        }

        logger.info(`Added tag ${tag} to ${archiveName}`);
    }

    async removeTag(archiveName: string, tag: string): Promise<void> {
        const doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            logger.silly(`Archive info ${archiveName} already exists, updte it`);

            const tags = new Set(doc.tags);
            tags.delete(tag);
            doc.tags = Array.from(tags);

            await this.database.update(pick(doc, '_id'), doc);
        }
        else {
            logger.warn(`No archive info for ${archiveName} when remove tag, should not be possible`);
        }

        logger.info(`Removed tag ${tag} from ${archiveName}`);
    }

    async allTags(): Promise<Array<{name: string, count: number}>> {
        const docs = await this.database.find({});
        const docTagPairs = docs.reduce(
            (result, doc) => {
                result.push(...doc.tags.map(tag => ({tag, doc})));
                return result;
            },
            [] as Array<{doc: PersistArchiveInfo, tag: string}>
        );
        const tags = Object.entries(countBy(docTagPairs, 'tag')).map(([name, count]) => ({name, count}));

        logger.info(`Found ${tags.length} tags`);

        return tags;
    }

    async tagCollisions(): Promise<CollisionTable> {
        const docs = await this.database.find({});
        const tagMap: Map<string, string[]> = docs.reduce(
            (map, {tags}) => tags.reduce((map, tag) => map.set(tag, (map.get(tag) || []).concat(tags)), map),
            new Map()
        );
        const collisionTable = Array.from(tagMap).reduce(
            (table, [tag, collisions]) => {
                const collisionIndex = countBy(collisions, identity);
                const base = collisionIndex[tag];
                const collisionProbabilities = Object.entries(collisionIndex).reduce(
                    (result, [currentTag, value]) => {
                        if (currentTag === tag || value / base < 0.2) {
                            return result;
                        }
                        return Object.assign(result, {[currentTag]: value / base});
                    },
                    {}
                );

                return Object.assign(table, {[tag]: collisionProbabilities});
            },
            {} as CollisionTable
        );
        return collisionTable;
    }
}

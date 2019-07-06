import path from 'path';
import {omit, pick, countBy, identity} from 'lodash';
import DataStore from 'nedb';
import {promisify} from 'util';
import {getLogger} from './util/logger';
import {bareName} from './util';

const logger = getLogger('storage');

const datastore = config => {
    const nedb = new DataStore(config);
    return ['remove', 'insert', 'findOne', 'find', 'update'].reduce(
        (instance, method) => {
            // eslint-disable-next-line no-param-reassign
            instance[method] = promisify(nedb[method]).bind(nedb);
            return instance;
        },
        {nedb}
    );
};

const stateToLog = state => {
    const log = Object.assign({}, state);
    log.archiveList = `(...${state.archiveList.length} files)`;
    return JSON.stringify(log);
};

export default class Storage {

    constructor(directory) {
        this.state = datastore({filename: path.join(directory, 'state.db'), autoload: true});
        this.database = datastore({filename: path.join(directory, 'main.db'), autoload: true});

        const interval = 1000 * 60 * 5;
        this.state.nedb.persistence.setAutocompactionInterval(interval);
        this.database.nedb.persistence.setAutocompactionInterval(interval);
    }

    async cleanup() {
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

    async saveState(state) {
        logger.info('Save state', stateToLog(state));

        try {
            await this.state.remove({}, {multiple: true});
            await this.state.insert(state);
        }
        catch (ex) {
            logger.error(ex);
        }
    }

    async restoreState() {
        const state = await this.state.findOne({});

        if (state) {
            logger.info(`Previously saved state is: ${stateToLog(state)}`);
            return state;
        }

        logger.info('No saved state');
        return null;
    }

    async findArchivesByTags(tags) {
        const docs = await this.database.find({tags: {$in: tags}});
        return docs.filter(doc => tags.every(tag => doc.tags.includes(tag)));
    }

    async getArchiveInfo(archive) {
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

    async addTag(archiveName, tag) {
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

    async removeTag(archiveName, tag) {
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

    async allTags() {
        const docs = await this.database.find({});
        const docTagPairs = docs.reduce((result, doc) => result.concat(doc.tags.map(tag => ({tag, doc}))), []);
        const tags = Object.entries(countBy(docTagPairs, 'tag')).map(([name, count]) => ({name, count}));

        logger.info(`Found ${tags.length} tags`);

        return tags;
    }

    async tagCollisions() {
        const docs = await this.database.find({});
        const tagMap = docs.reduce(
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
            {}
        );
        return collisionTable;
    }
}

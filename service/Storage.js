import {omit, pick, countBy, identity} from 'lodash';
import datastore from 'nedb-promise';
import path from 'path';
import log4js from 'log4js';

let logger = log4js.getLogger('storage');

let stateToLog = state => {
    let log = Object.assign({}, state);
    log.archiveList = `(...${state.archiveList.length} files)`;
    return log;
};

let bareName = file => path.basename(file, path.extname(file));

export default class Storage {

    constructor(directory) {
        this.state = datastore({filename: path.join(directory, 'state.db'), autoload: true});
        this.database = datastore({filename: path.join(directory, 'main.db'), autoload: true});

        let interval = 1000 * 60 * 5;
        this.state.nedb.persistence.setAutocompactionInterval(interval);
        this.database.nedb.persistence.setAutocompactionInterval(interval);
    }

    async cleanup() {
        logger.info('Compact database');

        this.state.nedb.persistence.compactDatafile();
        this.database.nedb.persistence.compactDatafile();

        let tasks = [
            new Promise(resolve => this.state.nedb.on('compaction.done', resolve)),
            new Promise(resolve => this.database.nedb.on('compaction.done', resolve))
        ];

        await Promise.all(tasks);

        logger.info('Compact database complete');
    }

    async saveState(state) {
        logger.info('Save state', JSON.stringify(stateToLog(state)));

        try {
            await this.state.remove({}, {multiple: true});
            await this.state.insert(state);
        }
        catch (ex) {
            logger.error(ex);
        }
    }

    async restoreState() {
        let state = await this.state.findOne({});

        if (state) {
            logger.info(`Previously saved state is: ${stateToLog(state)}`);
            return state;
        }

        logger.info('No saved state');
        return null;
    }

    async getArchiveInfo(archive) {
        let archiveName = bareName(archive);
        let doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            return omit(doc, '_id');
        }

        return {
            archive: archiveName,
            tags: []
        };
    }

    async addTag(archiveName, tag) {
        let doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            logger.trace(`Archive info ${archiveName} already exists, updte it`);

            let tags = new Set(doc.tags);
            tags.add(tag);
            doc.tags = Array.from(tags);
            await this.database.update(pick(doc, '_id'), doc);
        }
        else {
            logger.trace(`No archive info for ${archiveName}, insert new`);

            let newDoc = {
                archive: archiveName,
                tags: [tag]
            };
            await this.database.insert(newDoc);
        }

        logger.info(`Added tag ${tag} to ${archiveName}`);
    }

    async removeTag(archiveName, tag) {
        let doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            logger.trace(`Archive info ${archiveName} already exists, updte it`);

            let tags = new Set(doc.tags);
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
        let docs = await this.database.find({});
        let tags = new Set(docs.reduce((tags, doc) => tags.concat(doc.tags), []));

        logger.info(`Found ${tags.size} tags`);

        return Array.from(tags);
    }

    async tagCollisions() {
        let docs = await this.database.find({});
        let tagMap = docs.reduce(
            (map, {tags}) => tags.reduce((map, tag) => map.set(tag, (map.get(tag) || []).concat(tags)), map),
            new Map()
        );
        let collisionTable = Array.from(tagMap).reduce(
            (table, [tag, collisions]) => {
                let collisionIndex = countBy(collisions, identity);
                let base = collisionIndex[tag];
                let collisionProbabilities = Object.entries(collisionIndex).reduce(
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

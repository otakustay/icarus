/**
 * @file 信息持久化存储类
 * @author otakustay
 */

'use strict';

let u = require('underscore');
let logger = require('log4js').getLogger('storage');
let datastore = require('nedb-promise');
let path = require('path');

let stateToLog = state => {
    let log = Object.assign({}, state);
    log.archiveList = `(...${state.archiveList.length} files)`;
    return log;
};

let bareName = file => path.basename(file, path.extname(file));

/**
 * 存储封装类
 */
module.exports = class Storage {
    constructor(directory) {
        this.state = datastore({filename: path.join(directory, 'state.db'), autoload: true});
        this.database = datastore({filename: path.join(directory, 'main.db'), autoload: true});

        let interval = 1000 * 60 * 5;
        this.state.nedb.persistence.setAutocompactionInterval(interval);
        this.database.nedb.persistence.setAutocompactionInterval(interval);
    }

    /**
     * 保存应用状态
     *
     * @param {Object} state 状态对象
     */
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

    /**
     * 恢复应用状态
     *
     * @return {Object} 上一次保存的应用状态对象，如果没有保存的状态或者恢复失败，则返回`null`
     */
    async restoreState() {
        let state = await this.state.findOne({});

        if (state) {
            logger.info(`Previously saved state is: ${stateToLog(state)}`);
            return state;
        }

        logger.info('No saved state');
        return null;
    }

    /**
     * 获取压缩包在数据库中的信息
     *
     * @param {string} archive 压缩包路径
     * @return {Object} 相关信息
     */
    async getArchiveInfo(archive) {
        let archiveName = bareName(archive);
        let doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            return u.omit(doc, '_id');
        }

        return {
            archive: archiveName,
            tags: []
        };
    }

    /**
     * 为压缩包添加标签
     *
     * @param {string} archive 压缩包路径
     * @param {string} tag 标签
     */
    async addTag(archive, tag) {
        let archiveName = bareName(archive);
        let doc = await this.database.findOne({archive: archiveName});

        if (doc) {
            logger.trace(`Archive info ${archiveName} already exists, updte it`);

            let tags = new Set(doc.tags);
            tags.add(tag);
            doc.tags = Array.from(tags);
            await this.database.update(u.pick(doc, '_id'), doc);
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

    /**
     * 获取所有要标签
     *
     * @return {string[]}
     */
    async allTags() {
        let docs = await this.database.find({});
        let tags = new Set(docs.reduce((tags, doc) => tags.concat(doc.tags), []));

        logger.info(`Found ${tags.size} tags`);

        return Array.from(tags);
    }
};

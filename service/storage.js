/**
 * @file 信息持久化存储类
 * @author otakustay
 */

'use strict';

let denodeify = require('denodeify');
let fs = require('fs');
let mkdir = denodeify(require('mkdirp'));
let readFile = denodeify(fs.readFile);
let writeFile = denodeify(fs.writeFile);
let logger = require('log4js').getLogger('storage');

const ENCODING = 'utf-8';

let stateToLog = state => {
    let log = Object.assign({}, state);
    log.archiveList = `(...${state.archiveList.length} files)`;
    return log;
};

/**
 * 存储封装类
 */
module.exports = class Storage {
    constructor(directory) {
        this.directory = directory;
        this.stateFile = require('path').join(directory, 'state.json');
    }

    /**
     * 保存应用状态
     *
     * @param {Object} state 状态对象
     */
    async saveState(state) {
        logger.info('Save state', JSON.stringify(stateToLog(state)), 'to', this.stateFile);

        await mkdir(this.directory);
        await writeFile(this.stateFile, JSON.stringify(state), ENCODING);
    }

    /**
     * 恢复应用状态
     *
     * @return {Object} 上一次保存的应用状态对象，如果没有保存的状态或者恢复失败，则返回`null`
     */
    async restoreState() {
        try {
            let content = await readFile(this.stateFile, ENCODING);

            logger.info(`Previously saved state is: ${content}`);

            return JSON.parse(content);
        }
        catch (ex) {
            logger.info('No saved state');

            return null;
        }
    }
};

/**
 * @file 信息持久化存储类
 * @author otakustay
 */

'use strict';

let logger = require('log4js').getLogger('storage');
let datastore = require('nedb-promise');

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
        let filename = require('path').join(directory, 'state.db');
        this.state = datastore({filename: filename, autoload: true});
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
};

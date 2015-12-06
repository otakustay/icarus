/**
 * @file 全局上下文类
 * @author otakustay
 */

'use strict';

let LinkedList = require('../common/LinkedList');
let logger = require('log4js').getLogger('context');

/**
 * 应用后端全局上下文
 */
module.exports = class GlobalContext {
    constructor(ipc, storage) {
        this.ipc = ipc;
        this.storage = storage;
    }

    /**
     * 设置当前浏览的压缩文件列表
     *
     * @param {string[]} archiveList 压缩文件名称（不包含目录）数组
     * @param {string} browsingFile 当前正在浏览的压缩文件名称（不包含目录）
     */
    setArchiveList(archiveList, browsingFile) {
        this.archiveList = new LinkedList(archiveList);

        logger.debug(`Archive list is set to have ${archiveList.length} archives`);

        if (browsingFile) {
            this.archiveList.readyFor(browsingFile);

            logger.debug(`Move to archive ${browsingFile}`);
        }
    }

    /**
     * 设置当前浏览的图片列表
     *
     * @param {string[]} imageList 图片文件名称（不包含目录）数组
     * @param {string} browsingImage 当前正在浏览的图片文件名称（不包含目录）
     */
    setImageList(imageList, browsingImage) {
        this.imageList = new LinkedList(imageList);

        logger.debug(`Image list is set to have ${imageList.length} images`);

        if (browsingImage) {
            this.imageList.readyFor(browsingImage);

            logger.debug(`Move to image ${browsingImage}`);
        }
    }

    /**
     * 保存状态
     */
    async persist() {
        logger.trace('Try to save state');

        let archiveList = this.archiveList && this.archiveList.toArray();
        let archive = this.archiveList && this.archiveList.current();
        let image = this.imageList && this.imageList.current();
        let dump = {
            archiveList: archiveList,
            archive: archive,
            image: image && image.name
        };
        let persistData = Object.entries(dump).reduce(
            (result, [key, value]) => {
                if (value) {
                    result[key] = value;
                    return result;
                }
            },
            {}
        );

        await this.storage.saveState(persistData);
    }
};

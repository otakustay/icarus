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
    constructor(ipc, storage, version) {
        this.ipc = ipc;
        this.storage = storage;
        this.version = version;
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

            logger.debug(`Move to image ${browsingImage.entryName}`);
        }
    }

    /**
     * 设置当前浏览的压缩文件
     *
     * @param {service.util.Archive} archive 压缩文件对象
     * @param {Object} [options] 额外配置项
     * @param {boolean} options.moveToLast = false 是否要移动到最后一张图片，由`previousImage`指令产生的移动要恢复到最后一张
     * @param {boolean} options.moveToImage 设置要恢复的图片
     */
    setBrowsingArchive(archive, options = {}) {
        this.browsingArchive = archive;
        let imageList = archive.entries;

        if (options.moveToLast) {
            this.setImageList(imageList, imageList[imageList.length - 1]);
        }
        else {
            this.setImageList(imageList);

            if (options.moveToImage) {
                let entry = imageList.filter(image => image.entryName === options.moveToImage)[0];
                if (entry) {
                    this.imageList.readyFor(entry);
                }
            }
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
            image: image && image.entryName,
            version: this.version
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

    dispose() {
        return this.storage.cleanup();
    }
};

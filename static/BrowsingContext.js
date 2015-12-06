/**
 * @file 前端浏览上下文类
 * @author otakustay
 */

'use strict';

let LinkedList = require('../common/LinkedList');

/**
 * 前端浏览上下文对象
 */
module.exports = class BrowsingContext {
    constructor(ipc, surface) {
        this.ipc = ipc;
        this.surface = surface;
        this.surface.browsingContext = this;
        this.isLocked = false;
        this.steps = null;
    }

    /**
     * 锁定应用，此时应用不响应任何快捷键
     */
    lock() {
        this.isLocked = true;
    }

    /**
     * 解除锁定状态
     */
    unlock() {
        this.isLocked = false;
    }

    /**
     * 设置图片的阅读步骤
     *
     * @param {meta.Transform[]} steps 阅读步骤
     */
    setSteps(steps) {
        this.steps = new LinkedList(steps);
    }

    restore() {
        this.surface.invokeWidget('loading', 'start');
        this.ipc.send('restore');
    }
};

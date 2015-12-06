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
        this.steps = null;
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

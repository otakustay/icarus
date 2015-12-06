/**
 * @file 上一步指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到上一步（图片位置）
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = (browsingContext) => {
    let step = browsingContext.steps.previous();

    if (!step) {
        require('./previousImage')(browsingContext);
        return;
    }

    browsingContext.surface.transformImage(step);
};

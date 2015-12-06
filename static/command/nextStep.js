/**
 * @file 下一步指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到下一步（图片位置）
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    let step = browsingContext.steps.next();

    if (!step) {
        require('./nextImage')(browsingContext);
        return;
    }

    browsingContext.surface.transformImage(step);
};

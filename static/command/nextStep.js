/**
 * @file 下一步指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到下一步（图片位置）
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    let step = surface.steps.next();

    if (!step) {
        require('./nextImage')(surface);
        return;
    }

    surface.transformImage(step);
};

/**
 * @file 上一步指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到上一步（图片位置）
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    let step = surface.steps.previous();

    if (!step) {
        require('./previousImage')(surface);
        return;
    }

    surface.transformImage(step);
};

/**
 * @file 切换全屏指令
 * @author otakustay
 */

'use strict';

/**
 * 进入/退出全屏
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    surface.toggleFullscreen();
};

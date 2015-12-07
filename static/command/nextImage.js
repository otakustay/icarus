/**
 * @file 下一张图片指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到下一张图片
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    surface.ipc.send('next-image');
    surface.invokeWidget('loading', 'start');
};

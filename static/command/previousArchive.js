/**
 * @file 上一个压缩文件指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到上一个压缩文件
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    surface.steps = null;
    surface.ipc.send('previous-archive');
    surface.invokeWidget('loading', 'start');
};

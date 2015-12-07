/**
 * @file 下一个压缩文件指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到下一个压缩文件
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    surface.setSteps(null);
    surface.ipc.send('next-archive');
    surface.invokeWidget('loading', 'start');
};

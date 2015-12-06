/**
 * @file 下一张图片指令
 * @author otakustay
 */

'use strict';

/**
 * 移动到下一张图片
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    browsingContext.ipc.send('next-image');
    browsingContext.surface.invokeWidget('loading', 'start');
};

/**
 * @file 提示没有更多内容
 * @author otakustay
 */

'use strict';

/**
 * 显示无更多图片的提示
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 * @param {Object} result 返回的结果
 * @param {string} result.direction 移动的方向，为`"forward"`或`"backward"`
 */
module.exports = (browsingContext, result) => {
    browsingContext.surface.invokeWidget('loading', 'stop');
    let message = '不能继续往' + (result.direction === 'forward' ? '后' : '前') + '翻了';
    browsingContext.surface.warn(message);
};

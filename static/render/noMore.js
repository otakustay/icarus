/**
 * @file 提示没有更多内容
 * @author otakustay
 */

'use strict';

/**
 * 显示无更多图片的提示
 *
 * @param {static.Surface} surface 前端界面
 * @param {Object} result 返回的结果
 * @param {string} result.direction 移动的方向，为`"forward"`或`"backward"`
 */
module.exports = (surface, result) => {
    surface.invokeWidget('loading', 'stop');
    let message = '不能继续往' + (result.direction === 'forward' ? '后' : '前') + '翻了';
    surface.warn(message);
};

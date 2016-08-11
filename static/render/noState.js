/**
 * @file 没有保存的内容
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
    surface.warn('无法找到保存的阅读信息');
};

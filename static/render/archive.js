/**
 * @file 渲染图片
 * @author otakustay
 */

'use strict';

/**
 * 渲染图片
 *
 * @param {static.Surface} surface 前端界面
 * @param {Object} info 返回的结果
 */
module.exports = (surface, info) => {
    surface.invokeWidget('tag', 'update', info);
};

/**
 * @file 切换布局
 * @author otakustay
 */

'use strict';

/**
 * 切换布局
 *
 * @param {static.Surface} surface 前端界面
 * @param {Function} layout 布局函数
 */
module.exports = (surface, layout) => {
    surface.setLayout(layout);

    require('./nextStep')(surface);
};

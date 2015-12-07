/**
 * @file 小组件初始化入口
 * @author otakustay
 */

'use strict';

/**
 * 初始化小组件
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    let render = widgetName => {
        let module = require(`../widget/${widgetName}/${widgetName}`);
        surface.registerWidget(widgetName, module);
    };

    render('drop');
    render('loading');
    render('info');
    render('help');
    render('disturb');
};

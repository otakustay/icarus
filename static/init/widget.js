/**
 * @file 小组件初始化入口
 * @author otakustay
 */

'use strict';

/**
 * 初始化小组件
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    let surface = browsingContext.surface;

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

/**
 * @file 渲染器初始化入口
 * @author otakustay
 */

'use strict';

/**
 * 初始化渲染器
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    let connect = (channel, module) => {
        let render = require(`../render/${module}`);
        browsingContext.ipc.on(channel, (e, result) => render(browsingContext, result));
    };

    connect('image', 'image');
    connect('no-more', 'noMore');
};

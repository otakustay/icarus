/**
 * @file 渲染器初始化入口
 * @author otakustay
 */

'use strict';

/**
 * 初始化渲染器
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    let connect = (channel, module) => {
        let render = require(`../render/${module}`);
        surface.ipc.on(channel, (e, result) => render(surface, result));
    };

    connect('image', 'image');
    connect('no-more', 'noMore');
    connect('no-state', 'noState');
    connect('archive', 'archive');
};

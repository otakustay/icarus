/**
 * @file 加载条小组件
 * @author otakustay
 */

'use strict';

/**
 * 进度条
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Uril} util 工具对象
 * @return {Promise}
 */
exports.render = (surface, util) => {
    util.initStyle();
    return util.initTemplate();
};

/**
 * 启动进度条
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Uril} util 工具对象
 */
exports.start = (surface, util) => {
    let bar = document.getElementById('loading');

    if (bar) {
        return;
    }

    let html = util.renderTemplate('main');
    bar = util.createElementFromHTML(html);
    document.body.appendChild(bar);
};

/**
 * 停止并隐藏进度条
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Uril} util 工具对象
 */
exports.stop = () => {
    let bar = document.getElementById('loading');

    if (bar) {
        bar.remove();
    }
};

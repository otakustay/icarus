/**
 * @file 当前浏览的图片信息小组件
 * @author otakustay
 */

'use strict';

/**
 * 当前浏览的图片信息显示
 *
 * @param {static.BrowsingContext} context 前端上下文
 * @param {static.widget.Uril} util 工具对象
 * @return {Promise}
 */
exports.render = (context, util) => {
    util.initStyle();

    let render = () => {
        let html = util.renderTemplate('main');
        let label = util.createElementFromHTML(html);
        document.body.appendChild(label);
    };

    return util.initTemplate().then(render);
};

/**
 * 更新信息
 *
 *
 * @param {static.BrowsingContext} context 前端上下文
 * @param {static.widget.Uril} util 工具对象
 * @param {Object} data 图片信息数据
 */
exports.update = (context, util, data) => {
    let content = util.renderTemplate('content', data);
    let label = document.getElementById('info');
    label.innerHTML = content;
};

/**
 * 转换显示/隐藏状态
 */
exports.toggle = () => {
    let label = document.getElementById('info');
    let display = label.style.display;
    label.style.display = display ? '' : 'block';
};

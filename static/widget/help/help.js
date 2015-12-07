/**
 * @file 帮助面板小组件
 * @author otakustay
 */

'use strict';

/**
 * 帮助面板
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Uril} util 工具对象
 * @return {Promise}
 */
exports.render = (surface, util) => {
    util.initStyle();

    let render = () => {
        let data = {keyboardShortcuts: surface.getRegisteredKeyboardShorts()};
        let html = util.renderTemplate('main', data);
        let panel = util.createElementFromHTML(html);
        document.body.appendChild(panel);

        document.getElementById('github-issues').addEventListener(
            'click',
            e => {
                e.preventDefault();
                require('shell').openExternal(e.target.href);
            }
        );
    };

    return util.initTemplate().then(render);
};

/**
 * 转换显示/隐藏状态
 */
exports.toggle = () => {
    let panel = document.getElementById('help');
    let display = panel.style.display;
    panel.style.display = display ? '' : 'block';
};

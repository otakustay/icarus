/**
 * @file 打扰模式小组件
 * @author otakustay
 */

'use strict';

/**
 * 打扰模式，启动后加载一个网页覆盖正在浏览的内容
 *
 * @param {static.BrowsingContext} context 前端上下文
 * @param {static.widget.Uril} util 工具对象
 */
exports.render = (context, util) => {
    util.initStyle();
};

/**
 * 转换显示/隐藏状态
 */
exports.toggle = () => {
    let webview = document.getElementById('disturb');

    if (webview) {
        webview.remove();
        return;
    }

    webview = document.createElement('webview');
    webview.id = 'disturb';
    webview.src = 'https://www.taobao.com';
    document.body.appendChild(webview);
};

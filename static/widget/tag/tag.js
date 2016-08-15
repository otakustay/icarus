/**
 * @file 当前浏览的图片信息小组件
 * @author otakustay
 */

'use strict';

let u = require('underscore');

/**
 * 当前浏览的图片信息显示
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Util} util 工具对象
 * @return {Promise}
 */
exports.render = (surface, util) => {
    util.initStyle();

    let render = () => {
        let html = util.renderTemplate('main');
        let panel = util.createElementFromHTML(html);
        document.body.appendChild(panel);

        panel.addEventListener(
            'click',
            e => {
                let target = e.target;
                if (target.nodeName !== 'LI') {
                    return;
                }

                let isSelected = target.classList.contains('tag-selected');
                if (!isSelected) {
                    target.classList.add('tag-selected');
                    let archive = panel.querySelector('input[type="hidden"]').value;
                    surface.ipc.send('add-tag', {archive: archive, tag: target.innerText});
                }
            },
            false
        );

        panel.addEventListener(
            'keyup',
            e => {
                let target = e.target;
                if (target.nodeName !== 'INPUT') {
                    return;
                }

                e.stopPropagation();

                if (e.which !== 13) {
                    return;
                }

                let tag = target.value.trim();
                let tagElement = document.createElement('li');
                tagElement.innerText = tag;
                tagElement.classList.add('tag-selected');
                let container = panel.querySelector('ul');
                container.insertBefore(tagElement, container.firstChild);

                target.value = '';

                let archive = panel.querySelector('input[type="hidden"]').value;
                surface.ipc.send('add-tag', {archive, tag});
            }
        );
    };

    return util.initTemplate().then(render);
};

/**
 * 转换显示/隐藏状态
 */
exports.toggle = () => {
    let panel = document.getElementById('tag');
    let display = panel.style.display;
    panel.style.display = display ? '' : 'none';
    if (!panel.style.display) {
        document.getElementById('add-tag').focus();
    }
};

/**
 * 更新状态
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Util} util 工具对象
 * @param {Object} info 压缩包信息
 * @param {string} info.archive 压缩包名
 * @param {string[]} info.tags 压缩包上附带的标签
 * @param {string[]} info.allTags allTags全部的标签
 */
exports.update = (surface, util, info) => {
    let data = {
        selected: info.tags,
        unselected: u.difference(info.allTags, info.tags),
        archive: info.archive
    };
    let content = util.renderTemplate('content', data);
    let panel = document.getElementById('tag');
    panel.innerHTML = content;
};

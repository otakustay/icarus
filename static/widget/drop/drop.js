/**
 * @file 文件拖拽打开小组件
 * @author otakustay
 */

'use strict';

/**
 * 拖拽目录/文件并打开的组件
 *
 * @param {static.BrowsingContext} context 前端上下文
 * @param {static.widget.Uril} util 工具对象
 * @return {Promise}
 */
exports.render = (context, util) => {
    util.initStyle();

    let render = () => {
        let html = util.renderTemplate('main');
        let indicator = util.createElementFromHTML(html);
        document.body.appendChild(indicator);


        document.addEventListener('dragover', e => e.preventDefault(), false);
        document.addEventListener('dragenter', () => indicator.classList.add('accepting'), false);
        document.addEventListener('dragleave', () => indicator.classList.remove('accepting'), false);
        document.addEventListener(
            'drop',
            e => {
                e.stopPropagation();
                e.preventDefault();

                let file = e.dataTransfer.files[0];
                if (!file.type || file.type.includes('zip')) {
                    context.ipc.send('open', file.path);
                }
            },
            false
        );
    };

    return util.initTemplate().then(render);
};

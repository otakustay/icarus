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

                if (!e.dataTransfer.files.length) {
                    return;
                }

                // 只拖动一个目录或压缩文件，则浏览该目录下的所有压缩文件
                if (e.dataTransfer.files.length === 1) {
                    let file = e.dataTransfer.files[0];
                    if (!file.type || file.type.includes('zip')) {
                        context.ipc.send('open', file.path);
                    }
                }
                // 如果是多个压缩文件，则只浏览选中的这些。不支持多个目录
                else {
                    let files = Array.from(e.dataTransfer.files)
                        .filter(file => file.type.includes('zip'))
                        .map(file => file.path);
                    if (files.length) {
                        context.ipc.send('open-multiple', files);
                    }
                }
            },
            false
        );
    };

    return util.initTemplate().then(render);
};

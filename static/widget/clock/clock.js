/**
 * @file 时间小组件
 * @author otakustay
 */

'use strict';

let moment = require('moment');

/**
 * 时间小组件
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Uril} util 工具对象
 * @return {Promise}
 */
exports.render = (surface, util) => {
    util.initStyle();

    let clock = document.createElement('div');
    clock.id = 'clock';
    document.body.appendChild(clock);

    let update = () => {
        let now = moment();

        document.getElementById('clock').innerText = now.format('HH:mm');

        setTimeout(update, (60 - now.second()) * 1000);
    };

    update();

    return Promise.resolve();
};

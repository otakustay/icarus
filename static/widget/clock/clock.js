/**
 * @file 时间小组件
 * @author otakustay
 */

'use strict';

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
        let now = new Date();

        let hour = now.getHours().toString();
        if (hour.length === 1) {
            hour = '0' + hour;
        }
        let minute = now.getMinutes().toString();
        if (minute.length === 1) {
            minute = '0' + minute;
        }

        document.getElementById('clock').innerText = `${hour}:${minute}`;

        setTimeout(update, (60 - now.getSeconds()) * 1000);
    };

    update();

    return Promise.resolve();
};

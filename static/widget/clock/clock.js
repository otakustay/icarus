/**
 * @file 时间小组件
 * @author otakustay
 */

'use strict';

let moment = require('moment');
let stopwatchStartTime = null;

/**
 * 时间小组件
 *
 * @param {static.Surface} surface 前端界面
 * @param {static.widget.Uril} util 工具对象
 * @return {Promise}
 */
exports.render = (surface, util) => {
    util.initStyle();

    let render = () => {
        let html = util.renderTemplate('main');
        let clock = util.createElementFromHTML(html);
        document.body.appendChild(clock);

        let update = () => {
            let now = moment();

            document.querySelector('.clock-time').innerText = now.format('HH:mm');

            setTimeout(update, (60 - now.second()) * 1000);
        };

        update();
    };

    return util.initTemplate().then(render);
};

/**
 * 开启/关闭计时功能
 *
 * @param {static.Surface} surface 前端界面
 */
exports.toggleStopwatch = (surface) => {
    let element = document.querySelector('.stopwatch-indicator');
    if (stopwatchStartTime) {
        element.style.display = '';

        let now = moment();
        let totalSeconds = now.diff(stopwatchStartTime, 'seconds');
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        surface.warn('计时：' + (minutes ? `${minutes}分${seconds}秒` : `${seconds}秒`));

        stopwatchStartTime = null;
    }
    else {
        element.style.display = 'inline';

        stopwatchStartTime = moment();
    }
};

'use strict'

/**
 * 进度条
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 * @param {static.widget.Uril} util 工具对象
 */
exports.render = (context, util) => {
    util.initStyle()
    return util.initTemplate()
}

exports.start = (context, util) => {
    let bar = document.getElementById('loading')

    if (bar) {
        return
    }

    let html = util.renderTemplate('main')
    bar = util.createElementFromHTML(html)
    document.body.appendChild(bar)
}

exports.stop = () => {
    let bar = document.getElementById('loading')

    if (bar) {
        bar.remove()
    }
}

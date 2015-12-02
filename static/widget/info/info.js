'use strict'

/**
 * 当前浏览的图片信息显示
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 * @param {static.widget.Uril} util 工具对象
 */
exports.render = (context, util) => {
    util.initStyle()

    let render = () => {
        let html = util.renderTemplate('main')
        let label = util.createElementFromHTML(html)
        document.body.appendChild(label)
    }

    return util.initTemplate().then(render)
}

exports.update = (context, util, data) => {
    let content = util.renderTemplate('content', data)
    let label = document.getElementById('info')
    label.innerHTML = content
}

exports.toggle = () => {
    let label = document.getElementById('info')
    let display = label.style.display
    label.style.display = display ? '' : 'block'
}

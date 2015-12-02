'use strict'

/**
 * 帮助界面
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 * @param {static.widget.Uril} util 工具对象
 */
exports.render = (context, util) => {
    util.initStyle()

    let render = () => {
        let data = {keyboardShortcuts: context.surface.getRegisteredKeyboardShorts()}
        let html = util.renderTemplate('main', data)
        let panel = util.createElementFromHTML(html)
        document.body.appendChild(panel)

        document.getElementById('github-issues').addEventListener(
            'click',
            e => {
                e.preventDefault()
                require('shell').openExternal(e.target.href)
            }
        )
    }

    return util.initTemplate().then(render)
}

exports.toggle = () => {
    let panel = document.getElementById('help')
    let display = panel.style.display
    panel.style.display = display ? '' : 'block'
}

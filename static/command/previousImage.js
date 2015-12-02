'use strict'

/**
 * 移动到上一张图片
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    browsingContext.ipc.send('previous-image')
    browsingContext.surface.invokeWidget('loading', 'start')
}

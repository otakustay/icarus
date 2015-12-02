'use strict'

/**
 * 进入/退出全屏
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    browsingContext.surface.toggleFullscreen()
}

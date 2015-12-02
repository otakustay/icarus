'use strict'

/**
 * 移动到下一个压缩文件
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    browsingContext.steps = null
    browsingContext.ipc.send('next-archive')
    browsingContext.surface.invokeWidget('loading', 'start')
}

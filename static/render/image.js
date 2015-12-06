/**
 * @file 渲染图片
 * @author otakustay
 */

'use strict';

/**
 * 渲染图片
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 * @param {Object} result 返回的结果
 * @param {string} result.uri 图片的DataURI字符串
 */
module.exports = (browsingContext, result) => {
    let surface = browsingContext.surface;
    surface.invokeWidget('loading', 'stop');
    surface.createNewImage(result);
    let steps = browsingContext.layout(
        {width: surface.imageContainer.offsetWidth, height: surface.imageContainer.offsetHeight},
        {width: surface.imageElement.naturalWidth, height: surface.imageElement.naturalHeight}
    );
    browsingContext.setSteps(steps);

    require('../command/nextStep')(browsingContext, surface);
};

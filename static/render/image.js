/**
 * @file 渲染图片
 * @author otakustay
 */

'use strict';

/**
 * 渲染图片
 *
 * @param {static.Surface} surface 前端界面
 * @param {Object} result 返回的结果
 * @param {string} result.uri 图片的DataURI字符串
 */
module.exports = (surface, result) => {
    surface.invokeWidget('loading', 'stop');
    surface.createNewImage(result);
    let steps = surface.layout(
        {width: surface.imageContainer.offsetWidth, height: surface.imageContainer.offsetHeight},
        {width: surface.imageElement.naturalWidth, height: surface.imageElement.naturalHeight}
    );
    surface.setSteps(steps);

    require('../command/nextStep')(surface);
};

/**
 * @file 布局工具
 * @author otakustay
 */

'use strict';

/**
 * 计算一个方向上的居中偏移
 *
 * @param {number} scale 缩放比例
 * @param {number} containerValue 容器的长度数值
 * @param {imageValue} imageValue 图片的长度数值
 * @return {number} 为居中需要而产生的偏移量
 */
export let calculateCenteredTranslate = (scale, containerValue, imageValue) => {
    let gap = containerValue - imageValue * scale;
    return gap / 2 / scale;
};

/**
 * 计算让图片居中显示的变换对象
 *
 * @param {number} scale 缩放比例
 * @param {meta.Size} containerSize 容器尺寸
 * @param {meta.Size} imageSize 图片尺寸
 * @return {meta.Transform[]} 变换对象，长度始终为1
 */
export let calculateOneStepTransform = (scale, containerSize, imageSize) => [
    {
        scale: scale,
        translateX: exports.calculateCenteredTranslate(scale, containerSize.width, imageSize.width),
        translateY: exports.calculateCenteredTranslate(scale, containerSize.height, imageSize.height)
    }
];

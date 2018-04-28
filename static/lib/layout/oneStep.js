/**
 * @file 单步式布局
 * @author otakustay
 */


import {calculateOneStepTransform} from './util';

/**
 * 单步式布局
 *
 * 此布局简单地将图片缩放至宽或高占满容器
 *
 * @param {meta.Size} containerSize 容器尺寸
 * @param {meta.Size} imageSize 图片尺寸
 * @return {meta.Transform[]} 返回1步的数据
 */
export default (containerSize, imageSize) => {
    const scale = Math.min(
        containerSize.height / imageSize.height,
        containerSize.width / imageSize.width
    );
    return calculateOneStepTransform(scale, containerSize, imageSize);
};

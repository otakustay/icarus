/**
 * @file 上下两段式布局
 * @author otakustay
 */

'use strict';

let util = require('./util');

// 图片过大时，默认视窗为1.8倍的图片高度，这样分2步走的时候中间会有一些重叠，避免无重叠时一些文字阅读的困难
const VIEW_PORT_SCALE = 1.8;

/**
 * 智能上下两步式布局
 *
 * 此布局目标为采用1-2步完成一页漫画的阅读，其逻辑如下：
 *
 * 1. 如果图片本身比屏幕小，则等比例放大图片到屏幕尺寸，宽高先到为止
 * 2. 如果图片比较宽导致纵向合理的情况下横向会超出容器大小，则等比缩小宽度到容器宽度
 * 3. 如果图片高度小于容器高度的2倍，则不对图片进行缩放，分2步显示，2步显示的内容有所重叠
 * 4. 如果图片高度大于等于容器高度的2倍，则等比缩小图片高度到2倍容器高度，分2步显示
 *
 * @param {meta.Size} containerSize 容器尺寸
 * @param {meta.Size} imageSize 图片尺寸
 * @return {meta.Transform[]} 返回1-2步的数据
 */
module.exports = (containerSize, imageSize) => {
    // 图片很小，要放大占满容器宽或高
    if (imageSize.width < containerSize.width && imageSize.height < containerSize.height) {
        let scale = Math.min(
            containerSize.height / imageSize.height,
            containerSize.width / imageSize.width
        );
        return util.calculateOneStepTransform(scale, containerSize, imageSize);
    }

    let scale = Math.min(containerSize.height * VIEW_PORT_SCALE / imageSize.height, 1);

    // 高度调整后宽度超出容器了，需要继续缩小
    if (imageSize.width * scale > containerSize.width) {
        scale = containerSize.width / imageSize.width;
    }

    // 图片特别宽，宽度调整到容器一样时高度小于一屏
    if (imageSize.height * scale < containerSize.height) {
        return util.calculateOneStepTransform(scale, containerSize, imageSize);
    }

    let left = util.calculateCenteredTranslate(scale, containerSize.width, imageSize.width);
    // 第一步图片顶端贴住容器顶端，第二步图片底端贴住容器底端
    return [
        {scale: scale, translateX: left, translateY: 0},
        {scale: scale, translateX: left, translateY: (containerSize.height - imageSize.height * scale) / scale}
    ];
};

/**
 * @file 上下两段式布局
 * @author otakustay
 */

import {calculateCenteredTranslate, calculateOneStepTransform} from './util';

// 图片过大时，默认视窗为1.8倍的图片高度，这样分2步走的时候中间会有一些重叠，避免无重叠时一些文字阅读的困难
const VIEW_PORT_SCALE = 1.8;

export default (containerSize, imageSize) => {
    let scale = containerSize.height * VIEW_PORT_SCALE / imageSize.height;

    // 高度调整后宽度超出容器了，需要继续缩小
    if (imageSize.width * scale > containerSize.width) {
        scale = containerSize.width / imageSize.width;
    }

    // 图片特别宽，宽度调整到容器一样时高度小于一屏
    if (imageSize.height * scale < containerSize.height) {
        return calculateOneStepTransform(scale, containerSize, imageSize);
    }

    const left = calculateCenteredTranslate(scale, containerSize.width, imageSize.width);
    // 第一步图片顶端贴住容器顶端，第二步图片底端贴住容器底端
    return [
        {scale: scale, translateX: left, translateY: 0},
        {scale: scale, translateX: left, translateY: (containerSize.height - imageSize.height * scale) / scale},
    ];
};

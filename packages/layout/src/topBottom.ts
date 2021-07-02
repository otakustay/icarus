import {ComputeLayout} from './interface';
import {calculateOneStepTransform, calculateCenteredTranslate} from './utils';

// TODO: 如果缩放到不考虑`overlap`可以一屏放下，就放一屏

// 智能上下两步式布局
//
// 此布局目标为采用1-2步完成一页漫画的阅读，其逻辑如下：
//
// 1. 如果图片本身比屏幕小，则等比例放大图片到屏幕尺寸，宽高先到为止
// 2. 如果图片比较宽导致纵向合理的情况下横向会超出容器大小，则等比缩小宽度到容器宽度
// 3. 如果图片高度小于容器高度的2倍，则不对图片进行缩放，分2步显示，`overlap`表示2步间希望重叠部分与图片高度的比例，是0-1之间的值
// 4. 如果图片高度大于等于容器高度的2倍，则等比缩小图片高度到2倍容器高度，分2步显示

export default (overlap: number): ComputeLayout => {
    const containerScale = 2 - overlap;

    return (containerSize, imageSize) => {
        // 先按高度调整图片的缩放，不考虑其它因素
        const autoScale = containerSize.height * containerScale / imageSize.height;
        // 如果高度调整后宽度超出容器了，需要继续缩小，不能产生需要横向滚动的情况
        const scale = (imageSize.width * autoScale > containerSize.width)
            ? containerSize.width / imageSize.width
            : autoScale;

        // 图片特别宽，宽度调整到容器一样时高度小于一屏
        if (imageSize.height * scale <= containerSize.height) {
            return calculateOneStepTransform(scale, containerSize, imageSize);
        }

        const left = calculateCenteredTranslate(scale, containerSize.width, imageSize.width);
        // 第一步图片顶端贴住容器顶端，第二步图片底端贴住容器底端
        return [
            {scale: scale, translateX: left, translateY: 0},
            {scale: scale, translateX: left, translateY: (containerSize.height - imageSize.height * scale) / scale},
        ];
    };
};

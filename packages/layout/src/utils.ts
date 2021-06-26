import {Size} from '@icarus/shared';
import {LayoutTransform} from './interface';

// 计算一个方向上的居中偏移
export const calculateCenteredTranslate = (scale: number, containerValue: number, imageValue: number): number => {
    const gap = containerValue - imageValue * scale;
    return gap / 2 / scale;
};

// 计算让图片居中显示的变换对象
export const calculateOneStepTransform = (scale: number, containerSize: Size, imageSize: Size): LayoutTransform[] => [
    {
        scale: scale,
        translateX: calculateCenteredTranslate(scale, containerSize.width, imageSize.width),
        translateY: calculateCenteredTranslate(scale, containerSize.height, imageSize.height),
    },
];

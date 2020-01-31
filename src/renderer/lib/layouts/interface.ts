import {Size} from '../../../interface';

export interface LayoutTransform {
    scale: number;
    translateX: number;
    translateY: number;
}

export type ComputeLayout = (containerSize: Size, imageSize: Size) => LayoutTransform[];

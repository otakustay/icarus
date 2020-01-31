/**
 * @file 单步式布局
 * @author otakustay
 */


import {calculateOneStepTransform} from './util';
import {ComputeLayout} from './interface';

const oneStep: ComputeLayout = (containerSize, imageSize) => {
    const scale = Math.min(
        containerSize.height / imageSize.height,
        containerSize.width / imageSize.width
    );
    return calculateOneStepTransform(scale, containerSize, imageSize);
};

export default oneStep;

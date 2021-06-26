import {ComputeLayout} from './interface';
import {calculateOneStepTransform} from './utils';

export default (): ComputeLayout => (containerSize, imageSize) => {
    const scale = Math.min(
        containerSize.height / imageSize.height,
        containerSize.width / imageSize.width
    );
    return calculateOneStepTransform(scale, containerSize, imageSize);
};

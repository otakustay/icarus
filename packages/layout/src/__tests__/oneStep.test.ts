import oneStep from '../oneStep';

const layout = oneStep();

type Size = [number, number];
type Transform = [number, number, number];

const expectLayout = (imageSize: Size, expectedTransform: Transform) => {
    const [imageWidth, imageHeight] = imageSize;
    const [scale, translateX, translateY] = expectedTransform;

    return () => {
        const steps = layout(
            {width: 200, height: 200},
            {width: imageWidth, height: imageHeight}
        );
        expect(steps.length).toBe(1);
        expect(steps[0].scale).toBe(scale);
        expect(steps[0].translateX).toBe(translateX);
        expect(steps[0].translateY).toBe(translateY);
    };
};

test('just fit container', expectLayout([200, 200], [1, 0, 0]));

test('small height expand', expectLayout([10, 20], [10, 5, 0]));

test('small width expand', expectLayout([20, 10], [10, 0, 5]));

test('large height shrink', expectLayout([400, 1000], [0.2, 300, 0]));

test('large width shrink', expectLayout([1000, 400], [0.2, 0, 300]));

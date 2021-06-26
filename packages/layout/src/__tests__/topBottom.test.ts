import topBottom from '../topBottom';

const layout = topBottom(0.2);

type Size = [number, number];

interface Expect {
    scale: number;
    x: number;
    firstY: number;
    lastY?: number;
}

const expectLayout = (imageSize: Size, {scale, x, firstY, lastY}: Expect) => {
    const [imageWidth, imageHeight] = imageSize;

    return () => {
        const steps = layout(
            {width: 200, height: 200},
            {width: imageWidth, height: imageHeight}
        );
        expect(steps.length).toBe(typeof lastY === 'number' ? 2 : 1);
        expect(steps[0].scale).toBe(scale);
        expect(steps[0].translateX).toBe(x);
        expect(steps[0].translateY).toBe(firstY);
        if (typeof lastY === 'number') {
            expect(steps[1].scale).toBe(scale);
            expect(steps[1].translateX).toBe(x);
            expect(steps[1].translateY).toBe(lastY);
        }
    };
};

test('just fit container', expectLayout([200, 200], {scale: 1, x: 0, firstY: 0}));

test('small height expand', expectLayout([10, 36], {scale: 10, x: 5, firstY: 0, lastY: -16}));

test('small width expand to one step', expectLayout([20, 10], {scale: 10, x: 0, firstY: 5}));

test('large height shrink', expectLayout([300, 1200], {scale: 0.3, x: 55 / 0.3, firstY: 0, lastY: -160 / 0.3}));

test('large width shrink to one step', expectLayout([800, 300], {scale: 0.25, x: 0, firstY: 250}));

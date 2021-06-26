import {isImageExtension, constructImageInfo} from '../image';

test('image extension allow', () => {
    expect(isImageExtension('.jpg')).toBe(true);
    expect(isImageExtension('.jpeg')).toBe(true);
    expect(isImageExtension('.JPG')).toBe(true);
    expect(isImageExtension('.JPEG')).toBe(true);
    expect(isImageExtension('.png')).toBe(true);
    expect(isImageExtension('.PNG')).toBe(true);
    expect(isImageExtension('.bmp')).toBe(true);
    expect(isImageExtension('.BMP')).toBe(true);
});

test('construct image', () => {
    const data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8=';
    const png = Buffer.from(data, 'base64');
    const image = constructImageInfo('foo/bar.png', png);
    expect(image.name).toBe('foo/bar.png');
    expect(image.width).toBe(1);
    expect(image.height).toBe(1);
    expect(image.content).toBe(`data:image/png;base64,${data}`);
});

test('invalid image construct error', () => {
    const text = Buffer.from('Hello World');
    expect(() => constructImageInfo('foo/bar.png', text)).toThrow();
});

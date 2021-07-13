import path from 'path';
import fs from 'fs/promises';
import {isReadableImage, constructImageInfo} from '../image';

test('image extension allow', () => {
    expect(isReadableImage('foo.jpg')).toBe(true);
    expect(isReadableImage('foo.jpeg')).toBe(true);
    expect(isReadableImage('foo.JPG')).toBe(true);
    expect(isReadableImage('foo.JPEG')).toBe(true);
    expect(isReadableImage('foo.png')).toBe(true);
    expect(isReadableImage('foo.PNG')).toBe(true);
    expect(isReadableImage('foo.bmp')).toBe(true);
    expect(isReadableImage('foo.BMP')).toBe(true);
});

test('image exclude __MACOSX', () => {
    expect(isReadableImage('__MACOSX/foo.jpg')).toBe(false);
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

test('rotate image', async () => {
    const buffer = await fs.readFile(path.join(__dirname, 'fixtures', 'rotated.jpg'));
    const image = constructImageInfo('foo/bar.jpeg', buffer);
    expect(image.width).toBe(2);
    expect(image.height).toBe(1);
});

test('invalid image construct error', () => {
    const text = Buffer.from('Hello World');
    expect(() => constructImageInfo('foo/bar.png', text)).toThrow();
});

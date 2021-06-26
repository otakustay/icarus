import {extractName, isBookExtension, isImageExtension} from '../book';

test('extract name full location', () => {
    expect(extractName('/foo/bar.zip')).toBe('bar');
});

test('extract name bare filename', () => {
    expect(extractName('bar.zip')).toBe('bar');
});

test('extract name no extension', () => {
    expect(extractName('/foo/bar')).toBe('bar');
});

test('book extension allow', () => {
    expect(isBookExtension('.zip')).toBe(true);
    expect(isBookExtension('.rar')).toBe(false);
    expect(isBookExtension('.7z')).toBe(false);
});

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

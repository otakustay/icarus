import {extractName} from '../path';

test('extract name full location', () => {
    expect(extractName('/foo/bar.zip')).toBe('bar');
});

test('extract name bare filename', () => {
    expect(extractName('bar.zip')).toBe('bar');
});

test('extract name no extension', () => {
    expect(extractName('/foo/bar')).toBe('bar');
});

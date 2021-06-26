import {isBookExtension} from '../book';

test('book extension allow', () => {
    expect(isBookExtension('.zip')).toBe(true);
    expect(isBookExtension('.rar')).toBe(false);
    expect(isBookExtension('.7z')).toBe(false);
});

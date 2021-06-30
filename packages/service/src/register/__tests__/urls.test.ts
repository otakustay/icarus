import urls from '../urls';

test('shelf', () => {
    expect(typeof urls.shelf).toBe('string');
});

test('cursor', () => {
    expect(typeof urls.cursor).toBe('string');
});

test('filter', () => {
    expect(typeof urls.filter).toBe('string');
});

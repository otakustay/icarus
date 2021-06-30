import DefaultServiceContext from '../DefaultServiceContext';
import TestShelf from './mocks/Shelf';

test('constructor', () => {
    const shelf = new TestShelf();
    const params = {};
    const body = {};
    const context = new DefaultServiceContext(shelf, params, body);
    expect(context.shelf).toBe(shelf);
    expect(context.params).toBe(params);
    expect(context.body).toBe(body);
    expect(context.response.state).toBe('pending');
});

test('success', async () => {
    const context = new DefaultServiceContext(new TestShelf(), {}, {});
    await context.success(123);
    expect(context.response.state).toBe('hasValue');
    expect(context.response.state === 'hasValue' && context.response.data).toBe(123);
});

test('error', async () => {
    const context = new DefaultServiceContext(new TestShelf(), {}, {});
    await context.error('client', 'OPEN_FAIL', 'error');
    expect(context.response.state).toBe('hasError');
    expect(context.response.state === 'hasError' && context.response.code).toBe('OPEN_FAIL');
    expect(context.response.state === 'hasError' && context.response.type).toBe('client');
    expect(context.response.state === 'hasError' && context.response.message).toBe('error');
});

test('cache', async () => {
    const context = new DefaultServiceContext(new TestShelf(), {}, {});
    await context.cacheable(123);
    expect(context.cacheMaxAge).toBe(123);
});

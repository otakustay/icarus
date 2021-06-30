import registerTag from '../tag';
import urls, {ServiceURL} from '../urls';
import Registry from './mocks/Registry';

const registerAndExecute = async (method: 'GET' | 'POST', url: ServiceURL, params?: unknown, body?: unknown) => {
    const registry = new Registry();
    registerTag(registry);
    const context = await registry.execute(method, url, {params, body});
    return context;
};

test('find tags', async () => {
    const context = await registerAndExecute('GET', urls.tagsByBook, {bookName: 'book1'});
    expect(context.cacheMaxAge).toBe(0);
    expect(context.hasError).toBe(false);
    expect(context.response).toEqual(['book1:tag1', 'book1:tag2']);
});

test('find tags fail', async () => {
    const context = await registerAndExecute('GET', urls.tagsByBook, {bookName: 'error'});
    expect(context.hasError).toBe(true);
    expect(context.errorType).toBe('server');
    expect(context.errorCode).toBe('TAG_READ_FAIL');
});

test('list tags', async () => {
    const context = await registerAndExecute('GET', urls.tags);
    expect(context.cacheMaxAge).toBe(0);
    expect(context.hasError).toBe(false);
    expect(context.response).toEqual(['tag1', 'tag2', 'tag3']);
});

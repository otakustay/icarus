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

test('add tag', async () => {
    const context = await registerAndExecute(
        'POST',
        urls.tagsByBook,
        {bookName: 'book1'}, {tagName: 'tag1', active: true}
    );
    expect(context.hasError).toBe(false);
});

test('remove tag', async () => {
    const context = await registerAndExecute(
        'POST',
        urls.tagsByBook,
        {bookName: 'book1'}, {tagName: 'tag1', active: false}
    );
    expect(context.hasError).toBe(false);
});

test('apply tag empty book name', async () => {
    const context = await registerAndExecute(
        'POST',
        urls.tagsByBook,
        {bookName: ''}, {tagName: 'tag1', active: false}
    );
    expect(context.hasError).toBe(true);
    expect(context.errorType).toBe('client');
    expect(context.errorCode).toBe('TAG_WRITE_FAIL');
});

test('apply tag empty tag name', async () => {
    const context = await registerAndExecute(
        'POST',
        urls.tagsByBook,
        {bookName: 'book1'}, {tagName: '', active: false}
    );
    expect(context.hasError).toBe(true);
    expect(context.errorType).toBe('client');
    expect(context.errorCode).toBe('TAG_WRITE_FAIL');
});

test('apply tag error', async () => {
    const context = await registerAndExecute(
        'POST',
        urls.tagsByBook,
        {bookName: 'book1'}, {tagName: 'error', active: true}
    );
    expect(context.hasError).toBe(true);
    expect(context.errorType).toBe('server');
    expect(context.errorCode).toBe('TAG_WRITE_FAIL');
});

test('remove tag error', async () => {
    const context = await registerAndExecute(
        'POST',
        urls.tagsByBook,
        {bookName: 'book1'}, {tagName: 'error', active: false}
    );
    expect(context.hasError).toBe(true);
    expect(context.errorType).toBe('server');
    expect(context.errorCode).toBe('TAG_WRITE_FAIL');
});

test('suggest tags', async () => {
    const context = await registerAndExecute(
        'GET',
        urls.tagSuggestion,
        {bookName: 'book1'}
    );
    expect(context.hasError).toBe(false);
    expect(context.response).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
});

test('suggest tags error', async () => {
    const context = await registerAndExecute(
        'GET',
        urls.tagSuggestion,
        {bookName: 'error'}
    );
    expect(context.hasError).toBe(false);
    expect(context.response).toEqual([]);
});

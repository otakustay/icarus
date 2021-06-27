import registerOpen, {OpenByBooksBody, OpenByDirectoryBody, OpenByRestoreBody} from '../open';
import * as urls from '../urls';
import Registry from './mocks/Registry';

const registerAndExecute = async (body: OpenByBooksBody | OpenByDirectoryBody | OpenByRestoreBody) => {
    const registry = new Registry();
    registerOpen(registry);
    const context = await registry.execute('POST', urls.shelf, {body});
    return context;
};

test('register route', async () => {
    const registry = new Registry();
    registerOpen(registry);
    expect(registry.has('POST', urls.shelf)).toBe(true);
});

test('open by directory', async () => {
    const context = await registerAndExecute({type: 'directory', location: '/test'});
    expect(context.cacheMaxAge).toBe(0);
    expect(context.hasError).toBe(false);
    expect(context.response.book).toBeTruthy();
    expect(context.response.image).toBeTruthy();
});

test('open by books', async () => {
    const context = await registerAndExecute({type: 'books', locations: ['/test/book1', '/test/book2']});
    expect(context.cacheMaxAge).toBe(0);
    expect(context.hasError).toBe(false);
    expect(context.response.book).toBeTruthy();
    expect(context.response.image).toBeTruthy();
});

test('open by restore', async () => {
    const context = await registerAndExecute({type: 'restore'});
    expect(context.cacheMaxAge).toBe(0);
    expect(context.hasError).toBe(false);
    expect(context.response.book).toBeTruthy();
    expect(context.response.image).toBeTruthy();
});

test('open fail', async () => {
    const context = await registerAndExecute({type: 'directory', location: '/error'});
    expect(context.hasError).toBe(true);
    expect(context.errorCode).toBe('OPEN_FAIL');
});

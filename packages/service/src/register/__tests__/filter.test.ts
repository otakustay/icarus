import {ReadingFilter} from '@icarus/shared';
import registerFilter from '../filter';
import urls from '../urls';
import Registry from './mocks/Registry';

const registerAndExecute = async (body: ReadingFilter) => {
    const registry = new Registry();
    registerFilter(registry);
    const context = await registry.execute('POST', urls.filter, {body});
    return context;
};

test('register route', async () => {
    const registry = new Registry();
    registerFilter(registry);
    expect(registry.has('POST', urls.filter)).toBe(true);
});

test('apply tags', async () => {
    const context = await registerAndExecute({tagNames: ['tag1', 'tag2']});
    expect(context.cacheMaxAge).toBe(0);
    expect(context.hasError).toBe(false);
    expect(context.response.state.filter.tagNames).toEqual(['tag1', 'tag2']);
    expect(context.response.state.cursor.bookIndex).toBe(0);
    expect(context.response.state.cursor.imageIndex).toBe(0);
});

test('apply filter error', async () => {
    const context = await registerAndExecute({tagNames: ['tag1', 'error']});
    expect(context.cacheMaxAge).toBe(0);
    expect(context.hasError).toBe(true);
    expect(context.errorCode).toBe('OPEN_FAIL');
});

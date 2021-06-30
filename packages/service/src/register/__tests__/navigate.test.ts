import {ReadingCursor} from '@icarus/shared';
import registerNavigate from '../navigate';
import urls from '../urls';
import Registry from './mocks/Registry';

const registerAndExecute = async (start: ReadingCursor, url: string) => {
    const registry = new Registry();
    registerNavigate(registry);
    registry.setStartCursor(start.bookIndex, start.imageIndex);
    const context = await registry.execute('GET', url, {});
    return context;
};

test('next image', async () => {
    const context = await registerAndExecute({bookIndex: 0, imageIndex: 0}, urls.nextImage);
    expect(context.hasError).toBe(false);
    expect(context.response).toBeTruthy();
    expect(context.response.state.cursor.bookIndex).toBe(0);
    expect(context.response.state.cursor.imageIndex).toBe(1);
});

test('previous image', async () => {
    const context = await registerAndExecute({bookIndex: 0, imageIndex: 2}, urls.previousImage);
    expect(context.hasError).toBe(false);
    expect(context.response).toBeTruthy();
    expect(context.response.state.cursor.bookIndex).toBe(0);
    expect(context.response.state.cursor.imageIndex).toBe(1);
});

test('next book', async () => {
    const context = await registerAndExecute({bookIndex: 0, imageIndex: 0}, urls.nextBook);
    expect(context.hasError).toBe(false);
    expect(context.response).toBeTruthy();
    expect(context.response.state.cursor.bookIndex).toBe(1);
    expect(context.response.state.cursor.imageIndex).toBe(0);
});

test('previous book', async () => {
    const context = await registerAndExecute({bookIndex: 2, imageIndex: 0}, urls.previousBook);
    expect(context.hasError).toBe(false);
    expect(context.response).toBeTruthy();
    expect(context.response.state.cursor.bookIndex).toBe(1);
    expect(context.response.state.cursor.imageIndex).toBe(0);
});

test('error', async () => {
    const context = await registerAndExecute({bookIndex: 0, imageIndex: 0}, urls.previousBook);
    expect(context.hasError).toBe(true);
    expect(context.errorCode).toBe('MOVE_FAIL');
});

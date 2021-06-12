import {runLatest} from '../function';

test('single run', async () => {
    const task = jest.fn(() => Promise.resolve());
    const run = runLatest(task);
    await run();
    expect(task).toHaveBeenCalledTimes(1);
});

test('rerun waiting', async () => {
    const task = jest.fn(() => Promise.resolve());
    const run = runLatest(task);
    await Promise.all([run(), run()]);
    expect(task).toHaveBeenCalledTimes(2);
});

test('cancel previous waiting', async () => {
    const task = jest.fn(() => Promise.resolve());
    const run = runLatest(task);
    await Promise.all([run(), run(), run()]);
    expect(task).toHaveBeenCalledTimes(2);
});

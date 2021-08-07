import cached from '../cached';

test('pass through', async () => {
    const read = cached((value: number) => Promise.resolve(value));
    const value = await read(123);
    expect(value).toBe(123);
});

test('cache value', async () => {
    const value = {};
    const read = cached(() => Promise.resolve(value));
    await read(1);
    const secondRead = await read(1);
    expect(secondRead).toBe(value);
});

test('cahce by key', async () => {
    const read = cached(() => Promise.resolve({}));
    const firstRead = await read(1);
    const secondRead = await read(2);
    expect(firstRead).not.toBe(secondRead);
});

test('capacity expire', async () => {
    const read = cached(value => Promise.resolve({value}), 2);
    const old = await read(1);
    await read(2);
    const future = await read(3);
    const oldAgain = await read(1);
    const futureAgain = await read(3);
    expect(oldAgain).not.toBe(old);
    expect(futureAgain).toBe(future);
});

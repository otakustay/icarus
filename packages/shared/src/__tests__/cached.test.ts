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

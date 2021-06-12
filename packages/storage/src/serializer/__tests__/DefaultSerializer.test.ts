import DefaultSerializer from '../DefaultSerializer';

test('serialize', () => {
    const serializer = new DefaultSerializer();
    expect(serializer.serialize({x: 1})).toBe('{"x":1}');
});

test('deserialize', () => {
    const serializer = new DefaultSerializer();
    expect(serializer.deserialize('{"x":1}')).toEqual({x: 1});
});

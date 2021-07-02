import CollabrativeMatrix from '../CollabrativeMatrix';

test('collabrative filter', () => {
    const input = [
        [1, 1, 1, 0],
        [1, 0, 1, 1],
        [1, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    const matrix = new CollabrativeMatrix(input);
    const ratings = matrix.filterByUser(2);
    expect(ratings.length).toBe(2);
    expect(ratings[0]).toEqual({item: 1, rating: 2});
    expect(ratings[1]).toEqual({item: 3, rating: 2});
});

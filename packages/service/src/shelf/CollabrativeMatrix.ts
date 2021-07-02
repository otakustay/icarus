interface ItemRating {
    item: number;
    rating: number;
}

class ItemRatingManager {
    private readonly ratingsByItem: Map<number, number> = new Map();

    rateItem(item: number): void {
        const currentRating = this.ratingsByItem.get(item);
        this.ratingsByItem.set(item, (currentRating ?? 0) + 1);
    }

    toArray(): ItemRating[] {
        const ratings = [...this.ratingsByItem.entries()].map(([item, rating]) => ({item, rating}));
        return ratings;
    }
}

// 暴力计算协同过滤
export default class CollabrativeMatrix {
    private readonly matrix: number[][];

    constructor(matrix: number[][]) {
        this.matrix = matrix;
    }

    filterByUser(user: number): ItemRating[] {
        const manager = new ItemRatingManager();
        // 找到所有商品在这个用户上的推荐属性
        this.forEachRatedItemByUser(
            user,
            // 如果用户推荐这个商品，就找到所有同样推荐这个商品的用户，称为“协同用户”
            item => this.forEachRatedUserByItem(
                item,
                // 对每一个协同用户，他们关心的商品均增加一个标记
                collabrativeUser => {
                    // 别把自己也算进来
                    if (collabrativeUser === user) {
                        return;
                    }

                    this.forEachRatedItemByUser(
                        collabrativeUser,
                        suggested => manager.rateItem(suggested)
                    );
                }
            )
        );
        const ratedItems = manager.toArray();
        const row = this.matrix[user];
        // 把自己已经推荐过的过滤掉，然后按权重排序
        return ratedItems.filter(v => !row[v.item]).sort((x, y) => y.rating - x.rating);
    }

    private forEachRatedItemByUser(user: number, callback: (item: number) => void) {
        const row = this.matrix[user];
        for (let item = 0; item < row.length; item++) {
            const rated = row[item];

            if (rated) {
                callback(item);
            }
        }
    }

    private forEachRatedUserByItem(item: number, callback: (user: number) => void) {
        for (let user = 0; user < this.matrix.length; user++) {
            const rated = this.matrix[user][item];

            if (rated) {
                callback(user);
            }
        }
    }
}

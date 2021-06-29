const rules = require('./webpack.rules');

module.exports = {
    entry: './main/index.ts',
    module: {
        rules,
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
    },
};

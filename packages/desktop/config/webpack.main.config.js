const rules = require('./webpack.rules');

module.exports = {
    entry: './main/index.ts',
    target: 'electron-main',
    module: {
        rules,
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        modules: ['node_modules'],
    },
};

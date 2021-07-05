module.exports = {
    entry: './main/index.ts',
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                test: /\.(m?js|node)$/,
                parser: {amd: false},
                use: {
                    loader: '@vercel/webpack-asset-relocator-loader',
                    options: {
                        outputAssetBase: 'native_modules',
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|\.webpack)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        modules: ['node_modules'],
    },
};

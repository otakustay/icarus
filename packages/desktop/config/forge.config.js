module.exports = {
    packagerConfig: {
        name: 'Icarus Comic Reader',
    },
    makers: [
        {
            name: '@electron-forge/maker-dmg',
        },
    ],
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                mainConfig: './config/webpack.main.config.js',
                renderer: {
                    config: './config/webpack.renderer.config.js',
                    entryPoints: [
                        {
                            html: './renderer/entries/index.html',
                            js: './renderer/entries/index.tsx',
                            name: 'main_window',
                        },
                    ],
                },
            },
        ],
    ],
};

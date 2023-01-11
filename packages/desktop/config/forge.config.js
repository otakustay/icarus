module.exports = {
    packagerConfig: {
        name: 'Icarus Comic Reader',
        icon: './config/icon.icns',
    },
    makers: [
        {
            name: '@electron-forge/maker-dmg',
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-webpack',
            config: {
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
        },
    ],
};

/* eslint-disable import/unambiguous, import/no-commonjs, global-require */
const path = require('path');
const {createBuildConfig} = require('reskript');

const context = path.join(__dirname, '..');
const src = path.join(context, 'src');

const buildEnv = {
    mode: 'development',
    usage: 'play',
    clean: false,
    analyze: false,
    cwd: context,
    srcDirectory: src,
    buildTarget: 'stable',
    hostPackageName: 'icarus',
    entries: [],
    featureMatrix: {
        stable: {},
    },
    build: {
        extraLessPaths: [],
        extraLessVariables: {},
        styleResources: [],
        sourceCompilePackages: [],
        noCompileScripts: [],
        noModulesStyles: [],
        reportLintErrors: true,
        styleName: false,
        cssScope: false,
        largeAssetSize: 1024 * 1024 * 1024,
        browserSupport: {
            electron: '5.0.0',
        },
    },
    devServer: {
        hot: 'none',
    },
    addition() {
        return {};
    },
};

const [config] = createBuildConfig(buildEnv);

module.exports = {
    module: config.module,
    externals: config.externals,
    resolve: config.resolve,
    optimization: {
        minimize: false,
    },
};

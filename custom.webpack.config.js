const {createWebpackConfig, createRuntimeBuildEnv} = require('@reskript/config-webpack');
const projectSettings = require('./settings');

const buildEnv = {
    projectSettings,
    cwd: __dirname,
    hostPackageName: 'icarus-comic-reader',
    usage: 'build',
    mode: 'production',
    srcDirectory: 'src',
};
const runtimeBuildEnv = createRuntimeBuildEnv(buildEnv);
const buildContext = {
    ...runtimeBuildEnv,
    entries: [],
    features: {},
    buildTarget: 'stable',
    isDefaultTarget: false,
};
const config = createWebpackConfig(buildContext);

module.exports = {
    module: config.module,
    resolve: config.resolve,
    optimization: {
        minimize: false,
    },
};

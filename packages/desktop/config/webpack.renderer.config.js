const path = require('path');
const {createWebpackConfig, createRuntimeBuildEnv} = require('@reskript/config-webpack');
const {readProjectSettings} = require('@reskript/settings');

const cwd = process.cwd();

const createBaseConfig = () => {
    const projectSettings = readProjectSettings({cwd}, 'build');
    const entry = {
        file: path.join(cwd, 'renderer', 'entries', 'index.ts'),
        name: 'index',
        template: null,
        config: {},
    };
    const buildEnv = {
        hostPackageName: 'icarus',
        projectSettings,
        usage: 'build',
        mode: process.env.NODE_ENV || 'production',
        cwd,
        srcDirectory: 'renderer',
    };
    const runtimeBuildEnv = createRuntimeBuildEnv(buildEnv);
    const buildContext = {
        ...runtimeBuildEnv,
        entries: [entry],
        features: {},
        buildTarget: 'stable',
        isDefaultTarget: true,
    };
    const configuration = createWebpackConfig(buildContext);
    delete configuration.entry;
    delete configuration.output;
    return configuration;
};

const base = createBaseConfig();

module.exports = {...base, target: 'electron-renderer'};
